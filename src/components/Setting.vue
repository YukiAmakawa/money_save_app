<template>
  <div>
    <button class="setting-add-button" @click="openModal">＋</button>
    <Modal class="modal-form" @close="closeModal" v-if="modal">
      <div class="modal-input-box">
        <span class="modal-input-label">名前</span>
        <input class="modal-input"  v-model="newItem.name" placeholder="例：カフェ">
      </div>
      <div class="modal-input-box">
      <span class="modal-input-label">金額</span>
      <input class="modal-input" v-model="newItem.price" placeholder="例：300">
      </div>
      <template slot="footer">
        <button class="send-button" @click="sendItem">送信</button>
      </template>
    </Modal>
    <div class = "setting-wrap">
        <p class="title">設定</p>
        <p class="description">節約したい項目の名前と金額を設定しましょう</p>
        <table class="setting-item-table">
          <tr v-for="(item, index) in items" :key=index class="setting-item-list">
            <td class="setting-item-name">
              <input class="setting-input" v-model="item.name" @change="ChangeItem(index, item)">
            </td>
            <td class="setting-item-price">
              <input class="setting-input" v-model="item.price" @change="ChangeItem(index, item)"><span class="yen">円</span>
            </td>
            <td class="setting-item-trash"  @click="DeleteItem(index, item)">
              <div class="setting-i"><i class="fa fa-trash trash"></i></div>
            </td>
          </tr>
        </table>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import moment from 'moment'
import Modal from './modal.vue'
export default {
    name: 'Setting',
    components: { Modal },
    data(){
        return {
          newItem: { name:"", price:"", index: 0},
          items: [],
          modal: false,
          nextIndex: 0
        }
    },
    methods: {
      ChangeItem(index, item){
        db.collection('item').doc(`item${item.index}`).update({
          index: item.index, 
          name: item.name, 
          price: item.price,
      });
      },
      DeleteItem(index, item){
        let deletedItemIndex = item.index
        if(window.confirm(`「${item.name}」を削除して本当によろしいですか？`)){
          db.collection('item').doc(`item${deletedItemIndex}`).delete()
        }
        let newArray = this.items.filter((item) => item.index != deletedItemIndex);
        this.items = newArray
      },
      openModal(){
        this.modal = true;
      },
      closeModal(){
        this.modal = false
      },
      sendItem(){
        let newIndex = this.items.length == 0 ? 0 : Number(this.items.slice(-1)[0].index + 1);
        if(this.newItem.name && this.newItem.price){
          db.collection('item').doc(`item${newIndex}`).set({
          index: newIndex, 
          name: this.newItem.name, 
          price: this.newItem.price
      })
        .then( 
          this.items.push({ index: newIndex, name: this.newItem.name, price: this.newItem.price }),
          this.nextIndex++
        )
        .catch(function(error){
          alert(`${error}`)
        })
          this.newItem.name = "";
          this.newItem.price = "";
          this.closeModal();
        } else {
          alert('メッセージを入力してください')
        }
      }
    },
    created(){
      db.collection('item').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let data = doc.data();
          //　チェックされているものは反映
          this.items.push({ 
            index: data.index, 
            name: data.name, 
            price: data.price
            })
        })
      })
    },
}
</script>

<style>
.send-button {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  outline: none;
  cursor: pointer;
}
.modal-input-box {
  margin: 15px 0;
}
.modal-input-label {
  margin-right: 15px;
}
.modal-form {
  font-size: 18px;
}
.modal-input {
  font-size: 18px;
}
.setting-add-button {
  padding: 6px 12px;
  position: fixed;
  bottom: 100px;
  right: 30px;
  background-color: #d685b0;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  border-radius: 30px;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  border: none;
}

.setting-wrap {
  margin: 2em;
  max-width: 100%;
}

.title {
  font-size: 24px;
  color: #e4ad6d;
  font-weight: bold;
  border-bottom: solid 3px #e4ad6d;
  margin-bottom: 5px;
}

.description {
  font-size: 14px;
}
.setting-item-table {
  max-width: 350px;
  margin: 30px auto;
  font-size: 24px;
}

.setting-item-name {
  max-width: 150px;
  padding: 5px 0;
}
.setting-item-price {
  max-width: 110px;
  padding: 5px 0;
}

.setting-item-trash {
  margin-left: 10px;
  max-width: 50px;
  color: #999;
}
.setting-i{
  margin-left: 10px;
}
.trash {
  font-size: 18px;
}
.setting-input {
  max-width: 70%;
  height: 1em;
  font-size: 24px;
}

</style>


