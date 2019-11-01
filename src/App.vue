<template>
    <div id="app" class="d-flex flex-column justify-content-center align-items-center">

        <!-- container -->
        <div class="container d-flex justify-content-between align-items-center">
            <div class="calendar position-relative" style="margin-left: 10px;">

                <div style="width: 85%; margin: 0 auto 30px;">

                    <div class="button-row d-flex flex-column justify-content-center align-items-center w-100">
                        <font-awesome-icon icon="caret-left" @click="prev" class="icon left"/>
                        <div class="month-label d-flex align-items-center">{{ monthNames[current.getMonth()]}} {{ current.getFullYear()}}</div>
                        <font-awesome-icon icon="caret-right" @click="next" class="icon right"/>
                    </div>

                    <div class="calendar_dtw d-flex justify-content-between" style="margin-top: 10px;">
                        <div class="dtw">SUN</div>
                        <div class="dtw">MON</div>
                        <div class="dtw">TUE</div>
                        <div class="dtw">WED</div>
                        <div class="dtw">THU</div>
                        <div class="dtw">FRI</div>
                        <div class="dtw">SAT</div>
                    </div>

                </div>

                <transition-group name="weekList" tag="div" :key="idx" v-for="(week, idx) in dayList" class="week d-flex justify-content-center">
                    <day v-for="day in week" :day="day" :key="day.idx" @open="openPopupWindow(day.idx)">{{day}}</day>
                </transition-group>

            </div>

            <div class="info d-flex flex-column">
                <div class="date d-flex justify-content-center align-items-center">
                    <div class="dtw">{{ dayNames[now.getDay()] }}</div>
                    <div class="now">{{ now.getDate()}}th {{ monthNames[now.getMonth()]}} {{ now.getFullYear()}}</div>
                </div>
                <transition-group name="list" tag="div" class="list">
                    <item v-for="(item, idx) in nowDay.list" :item="item" :key="idx" @open="openEditPopup(idx)" @view="viewEdit(nowDay.list, item)">{{item}}</item>
                </transition-group>
                <div class="list_add_icon d-flex justify-content-center align-items-center" @click="openPopupLlistAdd">
                    <font-awesome-icon icon="plus" class="icon"/>
                </div>
            </div>

        </div>
        <!-- End of teg container -->

        <!-- popup -->
        <div id="popup" :class="['justify-content-center', 'align-items-center', 'd-flex', {'fadeIn': popupOpen, 'fadeOut': !popupOpen}]">
            <div class="inner d-flex flex-column position-relative">
                <div class="form-group w-100 d-flex flex-column">
                    <label for="text">해야할 일</label>
                    <input v-model="todoTitle" type="text" id="text" placeholder="할 일을 입력하세요"/>
                </div>
                <div class="form-group w-100 d-flex flex-column">
                    <label for="content">상세한 내용</label>
                    <input v-model="todoContent" type="text" id="content" placeholder="상세한 내용을 입력하세요"/>
                </div>
                <div class="position-absolute" style="bottom: 20px; right: 20px;">
                    <button type="button" @click="popupOpen = false" style="background-color: #b2b2b2; margin-right: 15px;">취소</button>
                    <button type="button" @click="saveTodo">완료</button>
                </div>
            </div>
        </div>
        <!-- End of teg popup -->
        
    </div>
</template>

<script>

    export default {
        name: "app",
        created() {
            let now = new Date();
            this.drawCalendar(now, now);
        },
        methods: {
            drawCalendar(now, thisNow) {
                this.now = thisNow;
                this.current = now;
                let first = now.getFirstDate();
                first.addDay(-first.getDay()); //달력의 최초 시작일이 나온다.
                this.dayList = [];
                while (true) {
                    let arr = [];
                    for (let i = 0; i < 7; i++) {
                        arr.push({idx: first.getTime(), date: first.clone(), list: [], now: this.now.getTime() == first.getTime(), nextDay: now.getMonth() != first.getMonth(), listCheck: false});
                        first.addDay(1);
                    }
                    this.dayList.push(arr);
                    if (first.getMonth() != now.getMonth()) {
                        this.MonthMap[now.getFullYear()+""+now.getMonth()] = this.dayList;
                        break;
                    }
                }

                this.dayList.forEach(week => {
                    week.forEach(day => {
                        if (day.now) {
                            this.currentPopupData = day.idx;
                            this.openPopupWindow(day.idx);
                        }
                    });
                });
            },
            prev() {
                let pre = this.current.clone();
                pre.setMonth(pre.getMonth() - 1);
                if(this.MonthMap[pre.getFullYear()+""+pre.getMonth()]){
                    this.dayList = this.MonthMap[pre.getFullYear()+""+pre.getMonth()];
                    this.current = pre;
                } else {
                    this.drawCalendar(pre, this.now);
                }
                this.currentPopupData = null;

                this.dayList.forEach(week => {
                    week.forEach(day => {
                        if (day.now) {
                            this.openPopupWindow(day.idx);
                        }
                    });
                });
            },
            next() {
                let nex = this.current.clone();
                nex.setMonth(nex.getMonth() + 1);
                if(this.MonthMap[nex.getFullYear()+""+nex.getMonth()]){
                    this.dayList = this.MonthMap[nex.getFullYear()+""+nex.getMonth()];
                    this.current = nex;
                } else {
                    this.drawCalendar(nex, this.now);
                }
                this.currentPopupData = null;

                this.dayList.forEach(week => {
                    week.forEach(day => {
                        if (day.now) {
                            this.openPopupWindow(day.idx);
                        }
                    });
                });
            },
            openPopupWindow(day) {
                this.currentPopupData = day;
                this.now = new Date(day);

                this.dayList.forEach(week => {
                    week.forEach(day => {
                        if (day.idx == this.currentPopupData) {
                            this.nowDay = day;
                            day.now = true;
                        } else {
                            day.now = false;
                        }
                    });
                });
            },
            openPopupLlistAdd() {
                if(this.currentPopupData == null) {
                    alert('일정을 추가할 날짜를 선택해주세요.');
                    return;
                }
                this.popupOpen = true;
            },
            saveTodo() {
                if(this.todoTitle.trim() == ''){
                    alert('할 일을 입력하세요');
                    return;
                } else if (this.todoTitle.length > "15") {
                    alert("할 일은 15자까지만 작성가능합니다.");
                    return;
                }

                if(this.todoContent.trim() == ''){
                    alert('상세한 내용을입력하세요');
                    return;
                } else if (this.todoContent.length > "35") {
                    alert("상세내용은 35자까지만 작성가능합니다.");
                    return;
                }

                if (this.currentEditItem != null) {
                    this.currentEditItem.name = this.todoTitle;
                    this.currentEditItem.content = this.todoContent;
                    this.currentEditItem = null;
                } else {
                    this.dayList.forEach(week => {
                        week.forEach(day => {
                            if (day.idx == this.currentPopupData) {
                                day.listCheck = true;
                                day.list.push({name: this.todoTitle, content: this.todoContent, icon:false});
                                this.nowDay = day;
                                document.querySelector('.info .list').scrollTop = document.querySelector('.info .list').scrollHeight;
                            }
                        });
                    });
                }

                this.popupOpen = false;
                this.todoTitle = "";
                this.todoContent = "";
            },
            openEditPopup(idx) {
                this.dayList.forEach(week => {
                    week.forEach(day => {
                        if (day.idx == this.currentPopupData) {
                            this.todoTitle = day.list[idx].name;
                            this.todoContent = day.list[idx].content;
                            this.currentEditItem = day.list[idx];
                            this.popupOpen = true;
                        }
                    });
                });
            },
            viewEdit(list, todo) {
                let item = '';
                document.querySelectorAll('.info .list .item').forEach(el => {
                    el.classList.remove('active');
                });

                if(event.target.classList.contains('c')) {
                    item = event.target.parentElement;
                } else if(event.target.classList.contains('title')) {
                    item = event.target.parentElement.parentElement;
                } else if(event.target.classList.contains('time')) {
                    item = event.target.parentElement.parentElement;
                } else {
                    item = event.target;
                }

                item.classList.add('active');

                list.forEach(data => {
                    data.icon = false;
                });
                todo.icon = true;
            }
        },
        data() {
            return {
                now: "",
                nowDay: [],
                current: null,
                dayList: [],
                MonthMap: [],
                popupOpen: false,
                currentPopupData: null,
                todoTitle: "",
                todoContent: "",
                currentEditItem: null,
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            };
        }
    };
</script>

<style src="./style.css"></style>