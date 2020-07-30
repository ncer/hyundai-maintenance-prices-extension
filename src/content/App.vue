<template>
  <Dialog
    id="hmpe-dialog"
    class="hmpe-dialog"
    title="Сравнительная таблица цен на ТО"
    :visible="isPopupVisible"
    width="90%"
    @close="onPopupClick"
  >
    <Form :inline="true" label-position="right" label-width="auto">
      <FormItem label="Модель">
        <Select v-model="models.car" placeholder="Модель" @change="updateCarList">
          <Option v-for="car in carList" :key="car.code" :label="car.name" :value="car.code" />
        </Select>
      </FormItem>
      <FormItem label="Год">
        <Select v-if="models.car" v-model="models.year" placeholder="Год" @change="updateYearList">
          <Option v-for="year in lists.year" :key="year" :label="year" :value="year" />
        </Select>
      </FormItem>
      <FormItem label="Тип двигателя">
        <Select
          v-if="models.year"
          v-model="models.engineType"
          placeholder="Тип двигателя"
          @change="updateEngineTypeList"
        >
          <Option v-for="type in lists.engineType" :key="type" :label="type" :value="type" />
        </Select>
      </FormItem>
      <FormItem label="Объем двигателя">
        <Select v-if="models.engineType" v-model="models.engine" placeholder="Объем двигателя">
          <Option v-for="engine in lists.engine" :key="engine" :label="engine" :value="engine" />
        </Select>
      </FormItem>
      <FormItem label="Пробег, тыс. км.">
        <Select v-model="models.mileage" placeholder="Пробег, тыс. км.">
          <Option v-for="mileage in lists.mileage" :key="mileage" :label="mileage" :value="mileage" />
        </Select>
      </FormItem>
      <FormItem label="Город">
        <Select v-model="models.city" placeholder="Город">
          <Option v-for="city in lists.city" :key="city.id" :label="city.name" :value="city.name" />
        </Select>
      </FormItem>
      <FormItem label=" ">
        <Button type="primary" @click="createTableData">Сформировать таблицу цен</Button>
      </FormItem>
    </Form>

    <Table v-if="table.length" :data="table" stripe style="width: 100% ">
      <TableColumn prop="name" label="Дилер" fixed sortable />
      <TableColumn prop="prices.originspares_nf" label="Стоимость оригинальных зап.частей" sortable />
      <TableColumn prop="prices.repairs_nf" label="Стоимость работ" sortable />
      <TableColumn prop="prices.total_nf" label="Итого" sortable />
      <TableColumn label="Контакты" width="400">
        <template slot-scope="scope">
          <div>
            <i class="el-icon-location" />
            <span>{{ scope.row.address }}</span>
          </div>
          <div>
            <i class="el-icon-phone" />
            <Link type="primary" :href="`tel:${scope.row.phone}`">{{ scope.row.phone }}</Link>
          </div>
          <div>
            <i class="el-icon-link" />
            <Link type="primary" :href="scope.row.site" target="_blank">{{ scope.row.site }}</Link>
          </div>
        </template>
      </TableColumn>
    </Table>
  </Dialog>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import { Icon, Link, Button, Dialog, Form, FormItem, Select, Option, Table, TableColumn, Loading } from 'element-ui'

export default {
  name: 'HMPEContentApp',

  components: {
    Icon,
    Link,
    Button,
    Dialog,
    Form,
    FormItem,
    Select,
    Option,
    Table,
    TableColumn,
    Loading,
  },

  data: () => ({
    loader: null,
    table: [],
    carList: [],
    dealerList: [],
    lists: {
      year: [],
      engineType: [],
      engine: [],
      mileage: [15, 30, 45, 60, 75, 90],
      city: [],
    },
    models: {
      car: 'solaris',
      year: '2011 - 2016',
      engineType: 'Бензиновый',
      engine: '1.4',
      mileage: '15',
      city: '',
    },
  }),

  computed: {
    ...mapState(['isPopupVisible']),
  },

  async mounted() {
    this.showLoader(true)

    Promise.all([
      await axios.get('https://www.hyundai.ru/ajax/new/getServiceJSON'),
      await axios.get('https://www.hyundai.ru/requestapi/getDealers?notest=1'),
    ]).then(values => {
      this.carList = values[0].data
      this.dealerList = values[1].data
      this.updateLists()
      this.showLoader(false)
    })
  },

  methods: {
    ...mapMutations(['SET_POPUP_VISIBILITY']),

    onPopupClick() {
      this.SET_POPUP_VISIBILITY(false)
    },

    createTableData() {
      this.showLoader(true)

      const params = Object.entries(this.models)
        .map(entry => {
          if (entry[0] !== 'city') {
            entry.splice(0, 1, entry[0].toLowerCase())
            entry.splice(1, 1, encodeURIComponent(entry[1]))
            return entry.join('=')
          }
        })
        .join('&')

      const currentCity = this.getCurrentCity()

      const dealers = currentCity?.dealers

      const requests = dealers.map(item => {
        return axios.get(`https://www.hyundai.ru/ajax/new/calculator?${params}&dealer=${item.code}&spares=0`)
      })

      Promise.all(requests).then(values => {
        this.table = dealers.map((dealer, i) => {
          let { originspares_nf, repairs_nf, total_nf } = values[i].data
          dealer.prices = {
            ...values[i].data,
            originspares_nf: originspares_nf ? originspares_nf : '0',
            repairs_nf: repairs_nf ? repairs_nf : '0',
            total_nf: total_nf ? total_nf : '0',
          }
          return dealer
        })

        this.showLoader(false)
      })
    },

    updateCarList() {
      this.lists.year = Object.keys(this.getCar().engines).sort() || []
      this.models.year = this.lists.year[0]

      this.updateYearList()
      this.updateEngineTypeList()
    },

    updateYearList() {
      this.lists.engineType = Object.keys(this.getCar().engines[this.models.year]) || []
      this.models.engineType = this.lists.engineType[0]

      this.updateEngineTypeList()
    },

    updateEngineTypeList() {
      this.lists.engine = this.getCar().engines[this.models.year][this.models.engineType]
      this.models.engine = this.lists.engine[0]
    },

    updateCityList() {
      this.lists.city = this.getCityList()
      this.models.city = this.lists.city[0].name
    },

    getCityList() {
      return this.dealerList
        .reduce((list, dealer) => {
          if (!list.find(item => +item.id === +dealer.city_id)) {
            list.push({
              id: dealer.city_id,
              name: dealer.city_name,
              dealers: this.dealerList.filter(item => +item.city_id === +dealer.city_id),
            })
          }
          return list
        }, [])
        .sort((a, b) => a.id - b.id)
    },

    updateLists() {
      this.updateCarList()
      this.updateYearList()
      this.updateEngineTypeList()
      this.updateCityList()
    },

    getCurrentCity() {
      return this.lists.city.find(item => item.name === this.models.city)
    },

    getCar() {
      return this.carList.find(item => item.code === this.models.car)
    },

    showLoader(isShown) {
      if (isShown) {
        this.loader = Loading.service({
          target: document.querySelector('#hmpe-dialog .el-dialog'),
          fullscreen: false,
        })
      } else {
        this.$nextTick(() => {
          this.loader.close()
          this.loader = null
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'node_modules/element-ui/packages/theme-chalk/src/common/var.scss';

$--font-path: 'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/theme-chalk/fonts';

@font-face {
  font-family: 'element-icons';
  src: url('#{$--font-path}/element-icons.woff') format('woff'),
    /* chrome, firefox */ url('#{$--font-path}/element-icons.ttf') format('truetype'); /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  font-weight: normal;
  font-display: $--font-display;
  font-style: normal;
}

.hmpe-dialog {
}
</style>
