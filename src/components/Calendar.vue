<template>
<div class="calendar-wrap">
        <p class="title">今月の記録</p>
        <div id="calendar-nav">
            <i class="menu-left" @click="moveLastMonth()">←</i>
            <span>{{calDate.year}}年{{getMonthName(calDate.month)}}</span>
            <i class="menu-right" @click="moveNextMonth()">→</i>
        </div>
        <table id="calendar-body" class="table table-bordered">
                <tr class="calender-week">
                    <th  v-for="(week, index) in weeks" :key="index">{{week}}</th>
                </tr>
            <tbody>
                <tr v-for="(week, index) in calendar" :key="index">
                    <td v-for="(day, index) in week" :key="index">
                        <p class="calender-date">{{day.day}}</p>
                        <p>{{items[day.day]}}</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="calender-total"><div>今週の節約金額</div><div class="calender-total-price">{{this.weekTotal}}円</div></div>
</div>

</template>

<script>
import db from '@/firebase/init';
import moment from 'moment';
export default {
    name: 'Calendar',
    data(){
        return {
            calDate: { year: 0, month: 0 },
            weeks: ['日','月','火','水','木','金','土'],
            items: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            weekTotal: 0
        }
    },
    methods: {
        getSelectedMonthItemData(){
        let selectedYearMonth = String(this.calDate.year) + String("0" + this.calDate.month)
            db.collection('date').orderBy('date').startAt(selectedYearMonth).endAt(selectedYearMonth + '\uf8ff').get()
                //データあり
                .then(snapshot => {
                    if(snapshot.size != 0){
                    let data = snapshot.forEach(doc => {
                    let day = (doc.data().date).slice(-2)
                    this.items.splice(day, 1, doc.data().total)
                    })
                    //データなし
                    } else {
                    this.items = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
                }).catch(function(error){
                console.log("Error getting document", error);
            })
        },
        getMonthName(month){
            let monthName = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
            return monthName[month - 1];
        },
        moveLastMonth(){
        if(this.calDate.month == 1){
            this.calDate.year--;
            this.calDate.month = 12;
        } else {
            this.calDate.month--
        }
        //firestoreのdocument取得のため選択した月をYYYYMMに直す
        let selectedYearMonth = String(this.calDate.year) + String(this.calDate.month)
        
            this.getSelectedMonthItemData();
        },
        moveNextMonth(){
            if(this.calDate.month == 12){
                this.calDate.year++;
                this.calDate.month = 1;
            } else {
                this.calDate.month++
            }
        //firestoreのdocument取得のため選択した月をYYYYMMに直す
            this.getSelectedMonthItemData();
        }
    },
    created: function(){
        this.calDate.year = moment().format("YYYY");
        this.calDate.month = moment().format("MM");
        //firestoreから今月のデータ取得
        let thisYearMonth = this.calDate.year + this.calDate.month
        db.collection('date').orderBy('date').startAt(thisYearMonth).endAt(thisYearMonth + '\uf8ff').get()
        .then(snapshot => {
            let data = snapshot.forEach(doc => {
                let day = (doc.data().date).slice(-2)
                this.items.splice(day, 1, doc.data().total)
            })
        let today = moment().format('YYYY-MM-DD');
        let whichWeek = moment(today).day();
        let whichDay = Number(moment().format('D'));
        // 初期化
        let weekTotal = 0;
        let beforeDayTotal = 0;
        let afterDayTotal = 0;
        // 今週の節約額の合計額
        let howManyTimesMinus = whichWeek + 1;
        for(let i = 1; i < howManyTimesMinus ; i++){
            beforeDayTotal += this.items[whichDay-i]
        }
        let howManyTimesPlus = 7 - whichWeek;
        for(let i = 1; i < howManyTimesPlus; i++){
            afterDayTotal += this.items[whichDay+i]
        }
        this.weekTotal = beforeDayTotal + this.items[whichDay] + afterDayTotal; 

      }).catch(function(error){
        console.log("Error getting document", error);
      })
    },
    computed: {
    calendar: function(){
        // 月初めの曜日の取得
        let firstDay = new Date(this.calDate.year, this.calDate.month - 1, 1).getDay();
        // 月終わりの日付取得
        let lastDate = new Date(this.calDate.year, this.calDate.month, 0).getDate();
        let dayIdx = 1;
        let calendar = [];
        
        for(let w = 0; w < 6; w++ ){
            let week = [];
            if (lastDate < dayIdx){ break; }
            for(let d = 0; d < 7; d++){
                if( w == 0 && d < firstDay){
                    week[d] = { day: '' };
                } else if ( w == 6 && lastDate < dayIdx ){
                    week[d] = { day: '' };
                    dayIdx++;
                } else if ( lastDate < dayIdx ){
                    week[d] = { day: '' };
                    dayIdx++;
                } else {
                    week[d] = { day: dayIdx };
                    dayIdx++;
                }
            }
            calendar.push(week);
        }
        return calendar;
    }
}
}
</script>

<style>
.title {
  font-size: 24px;
  color: #e4ad6d;
  font-weight: bold;
  border-bottom: solid 3px #e4ad6d;
  margin-bottom: 5px;
}

.calendar-wrap {
    max-width: 100%;
    margin: 2em;
}
.calendar {
    width: 100%;
    margin: 0 auto;
}
#calendar-nav {
    margin: 10px 0;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
}
.calender-week {
    color: #999;
    /* background-color: #999; */
}
.calender-date {
    border-bottom: solid 2px #EEE;
}
.calender-total {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
}
.calender-total-price {
    margin-right: 30px;
    font-size: 24px;
    font-weight: bold;
}
.table td {
    text-align: center;
    width: 50px;
    height: 60px;
    padding: 0;
}


</style>


