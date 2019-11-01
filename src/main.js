import Vue from 'vue';
import App from './App.vue';
import Day from './Day.vue';
import Item from './item.vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Date.prototype.clone = function(){
  return new Date(this);
}

Date.prototype.getFirstDate = function(){
  let temp = this.clone();
  temp.setDate(1);
  return temp;
}

Date.prototype.addDay = function(value) {
  this.setDate( this.getDate() + value);
}

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('day', Day);
Vue.component('item', Item);

new Vue({
  el: '#app',
  render: h => h(App)
})
