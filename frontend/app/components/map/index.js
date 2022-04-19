import './style.pcss';
import Collection from '../../js/collection'
import { getJS } from '../../js/utils/getJS'
import { getConfig } from '../../js/utils/getConfig'

export class Map {
  constructor (instance) {
    this.instance = instance
    this.map = null
    this.clusterer = null
    this.cfg = getConfig(this.instance, MapsCollection.instance)
    console.log(this.cfg)
    this.bindEvents()

  }

  init() {
    this.map = new ymaps.Map(this.instance, this.cfg)
    this.clusterer = new ymaps.Clusterer()
    this.clusterer.add(this.getPoints())
    this.map.geoObjects.add(this.clusterer)
  }

  getPoints() {
    return this.cfg.points.map(({coords, icon}) => new ymaps.Placemark(coords), {} )
  }

  bindEvents() {
    window.ymaps.ready(() => this.init())
  }
}

export default class MapsCollection extends Collection {
  static instance = '[data-js-map]'
  constructor () {
    super();
    this.load();
  }

  static urlAPI = "https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU"

  init() {
    document.querySelectorAll(MapsCollection.instance).forEach( el => {
      this.collection = new Map(el)
    })
  }

  load () {
    if (typeof window.ymaps ==='function') {
      this.init()
    } else {
      getJS({src:MapsCollection.urlAPI}).then(res => this.init(), err => console.debug(err))
    }
  }
}