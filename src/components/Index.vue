<template>
<div>
  <div class="fixed">
    <!-- <div class="comment-pig">
      <img class="pig" src="../assets/animal_buta.png" alt="">
      <img class="shibafu" src="../assets/line_shibafu.png" alt="">
    </div> -->
    <div class="total-box">
      <p class="total-comment">今日の達成額</p>
      <div class="total-amount">
        <p>{{String(totalPrice)}}<span class="yen">円</span></p>
      </div>
    </div>
  </div>
  <div class="item-wrap">
    <div class="item-box">
      <div v-for="(item, index) in items" :key="index">
        <div class="item-list">
        <label>
          <input class="item-checkbox" type="checkbox" v-model="item.check" @click="togglePrice(item)">
          <span class="item-name">{{item.name}}</span>
        </label>
          <p>{{String(item.price)}}<span class="yen">円</span></p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'
export default {
  name: 'Index',
  data () {
    return {
      totalPrice: 0,
      items: []
    }
  },
  methods: {
    togglePrice(item){
      item.check == false ? this.totalPrice += Number(item.price) : this.totalPrice -= Number(item.price);
      let date = new Date();
      let today = moment(date).format('YYYYMMDD');
      // DBに変更を反映
      let index = item.index
      db.collection('date').doc(today).update({
        [`item.${index}`]: !(item.check),
        total: this.totalPrice
      });
    }
  },
  created(){
    let date = new Date();
    let today = moment(date).format('YYYYMMDD');
    // DBからチェックされたアイテムを配列として取得
    db.collection('date').doc(today).get()
      .then(snapshot => {
            let data = snapshot.data();
            let checkedItem = Object.keys(data.item).filter(key => {
              return data.item[key] == true
            });
            //　アイテム一覧をリストにする
            db.collection('item').get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  let data = doc.data();
                  //　チェックされているものは反映
                  let IsItemChecked = checkedItem.some(item => item == data.index)
                  IsItemChecked == true ? this.totalPrice += Number(data.price) : '';
                  this.items.push({ 
                    index: data.index, 
                    name: data.name, 
                    price: data.price, 
                    check: IsItemChecked
                    })
                })
              })
          }
      ).catch(function(error){
        // this.totalPrice = "0";
        db.collection('item').get()
          .then(snapshot => {
            //this.にitemのデータを入れる
              self.totalPrice = 0;
              self.items = [];  
            snapshot.forEach(doc => {
              let data = doc.data();
              self.items.push({ 
                index: data.index, 
                name: data.name, 
                price: 0, 
                check: false
              })
            })
            let itemLength = snapshot.size;
            let itemArray = [];
            //firestoreに今日の日付でdoc作成
            for(let i=0; i < itemLength ; i++){
              var newObj = new Object();
              newObj[i] = false
              itemArray.push(newObj);
            }

            db.collection('date').doc(today).set({
            date: today,
            item: itemArray,
            total: 0
            })
        })
        .catch(function(error){
         console.log("Error getting document", error);
        })
  })
}
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
 .fixed {
    top: 0;
    width: 100%;
    padding: 2em 0;
    height: 150px;;
    position: fixed;
    background-color: #FFF;
    z-index: 1;
  }
  /* .comment-pig {
    margin-top: 30px;
  }
  .shibafu {
    position: relative;
    width: 100%;
    }
  .pig {
    position: absolute;
    width: 60px;
    height: 60px;
    top: 15px;
    right: 50%;
  } */
  .total-box {
    /* width: 100%; */
    margin: 2em;
  }
  .total-amount {
    text-align: center;
    margin: 0 auto;
  }
  .total-amount p {
    font-size: 4em;
    font-weight: bold;
  }

  .yen {
    margin-left: 0.3em;
    font-size: 0.4em;
    color: #808080;
  }

.item-wrap {
  max-width: 100%;
  margin: 260px 2em;
}

.item-list {
  display: grid;
  font-size: 24px;
  grid-template-columns: 3fr 1fr;
  margin: 1em 0;
  padding-left: 2em;
}
.yen {
  margin-left: 0.3em;
  font-size: 0.6em;
  color: #808080;
}

.item-checkbox {
  display: none;
}

.item-name {
  position:relative;
}
.item-name::before{
  position: absolute;
  content: "";
  display: block;
  top: 12%;
  left: -40px;
  width: 20px;
  height: 20px;
  border: 2px solid #aaaaaa;
  border-radius: 6px;
}

.item-checkbox:checked + .item-name::before {
  position: absolute;
  font-family: "Font Awesome 5 Free";
  content: '\f00c';
  font-weight: 900;
  font-size: 1.3em;
  color: #d685b0;
  line-height: 20px;
  text-align: center;
}
</style>
