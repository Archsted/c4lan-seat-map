<template>
    <div class="map">
        <div class="map--content">
            <div v-for="column in columns" :key="column.name" class="map-column">
                <div class="map-column__column-header">
                    {{ column.name }}
                </div>
                <div class="map-column__seat-column">
                    <div v-for="side in sides" :key="`${column.name}${side}`" class="map-column__seat-side">

                        <template v-for="row in maxRow">
                            <div class="seat" :key="`${column.name}${side}-${row}`" :class="getSeatClass(column, side, row)">
                                <img
                                    v-if="getAttendee(column, side, row)"
                                    :src="getImagePath(column, side, row)"
                                    alt=""
                                    v-tooltip.right-end="getAttendeePopup(getAttendee(column, side, row))"
                                    @click="openWindow(getAttendee(column, side, row).twitter)"
                                    :class="{hasTwitter: getAttendee(column, side, row).twitter}"
                                >
                                <span v-else-if="isReservedSeat(column, row)">
                                    [展示席]
                                </span>
                                <span v-else-if="isExistsSeat(column, row)">
                                    {{ column.name }}{{ side }}-{{formatRowNumber(row)}}
                                </span>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="map-column__column-footer">
                    {{ column.name }}
                </div>
            </div>
        </div>
        <div class="map--footer">
            ブラウザ最大化推奨。このページはC4LANのファンサイトです。内容について公式に問い合わせすることはお止めください。 / <a href="https://2019w.c4-lan.com/">C4LAN 2019 Winter 公式サイト</a> / <a href="https://2019w.c4-lan.com/attendees/">参加者一覧ページ</a> / <a href="https://twitter.com/etude_kaicho">このページ作った人</a>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data: () => ({
            isReady: false,
            maxRow: 22,
            sides: ['L', 'R'],
            columns: [
                {
                    'name': 'A',
                    'minRow': 1,
                    'maxRow': 18,
                },
                {
                    'name': 'B',
                    'minRow': 1,
                    'maxRow': 20,
                },
                {
                    'name': 'C',
                    'minRow': 1,
                    'maxRow': 22,
                },
                {
                    'name': 'D',
                    'minRow': 1,
                    'maxRow': 22,
                },
                {
                    'name': 'E',
                    'minRow': 5,
                    'maxRow': 22,
                },
                {
                    'name': 'F',
                    'minRow': 13,
                    'maxRow': 22,
                },
                {
                    'name': 'G',
                    'minRow': 13,
                    'maxRow': 22,
                },
                {
                    'name': 'H',
                    'minRow': 5,
                    'maxRow': 22,
                },
                {
                    'name': 'I',
                    'minRow': 1,
                    'maxRow': 22,
                },
                {
                    'name': 'J',
                    'minRow': 1,
                    'maxRow': 22,
                },
                {
                    'name': 'K',
                    'minRow': 1,
                    'maxRow': 20,
                },
            ],
            seat: {},
            attendees: [],
        }),
        created() {
            this.getAttendees()
        },
        methods: {
            getAttendees() {
                return new Promise( (resolve, reject) => {
                    axios.get('/api/attendees')
                        .then( response => {
                            this.attendees = response.data
                            this.isReady = true
                            resolve()
                        })
                        .catch( () => {
                            reject(`参加者データの読み込みに失敗しました`)
                        })
                })
            },
            getSeatClass(column, side, row) {
                return {
                    'seat--no-seat': !this.isExistsSeat(column, row),
                    'seat--no-attendee': this.isExistsSeat(column, row) && !this.getAttendee(column, side, row) && !this.isReservedSeat(column, row),
                    'seat--reserved': this.isReservedSeat(column, row)
                }
            },
            getAttendee(column, side, row) {
                return this.attendees.find( attendee => {
                    return attendee.column === column.name &&
                        attendee.side === side &&
                        attendee.row === row
                })
            },
            getAttendeePopup(attendee) {
                let content = `[${attendee.column}${attendee.side}-${this.formatRowNumber(attendee.row)}]<br>`

                if (attendee.name) {
                    content = content + `<strong>${attendee.name}</strong>` + '<br>'
                }

                if (attendee.group) {
                    content = content + attendee.group + '<br>'
                }

                if (attendee.favorite) {
                    content = content + attendee.favorite + '<br>'
                }

                if (attendee.message) {
                    content = content + this.stabWordBreak(attendee.message)
                }

                if (attendee.image) {
                    let imageHtml = `<div class="attendee--image"><img src="${attendee.image}" alt=""></div>`
                    content = imageHtml + content
                }

                return {
                    content: content,
                    delay: {show: 0, hide: 0},
                }
            },
            getImagePath(column, side, row) {
                const targetAttendee = this.getAttendee(column, side, row)

                if (targetAttendee) {
                    if (targetAttendee.image) {
                        return targetAttendee.image
                    } else {
                        return 'https://2019w.c4-lan.com/images/attendee_placeholder.jpg'
                    }
                }
            },
            isReservedSeat(column, row) {
                if (column.name === 'H') {
                    if (row >= 15 && row <= 22) {
                        return true
                    }
                }

                return false
            },
            isExistsSeat(column, row) {
                return row >= column.minRow && row <= column.maxRow
            },
            stabWordBreak(str) {
                let result = ""
                const maxWord = 3000

                let count = 0
                while (str.substr(count * maxWord, maxWord).length > 0) {
                    result = result + str.substr(count * maxWord, maxWord) + '<br>'
                    count++
                }

                return result
            },
            openWindow(url) {
                if (url) {
                    window.open(url, '_blank')
                }
            },
            formatRowNumber(num) {
                const paddingString = "0" + num
                return paddingString.slice(-2)
            },
        },
    }
</script>

<style scoped>
    .map {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .map--header {
        height: 20px;
    }
    .map--footer {
        padding: 4px 0;
        text-align: center;
        background-color: #000000;
        color: #ffffff;
        font-size: 90%;
        height: 20px;
    }
    .map--footer a {
        color: #ffff00;
        text-decoration: none;
    }

    .map--content {
        height: calc(100% - 20px);

        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;

        background-color: #000000;
    }

    .map-column {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 20px;
    }
    .map-column:first-child {
        margin-right: 0;
    }

    .map-column__column-header,
    .map-column__column-footer {
        text-align: center;
        background-color: #aaaaff;
    }

    .map-column__seat-column {
        height: 100%;

        display: flex;
        align-content: space-between;
    }

    .map-column__seat-side {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .seat {
        position: relative;

        height: 100%;
        width: 100%;
        text-align: center;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .seat--no-attendee {
        box-shadow: 1px 1px 0 rgba(255, 255, 255, .4) inset,
        0 0 4px rgba(200, 0, 0, .8) inset,
        2px 2px 2px rgba(200, 0, 0, .4);

        background: -webkit-repeating-linear-gradient(-45deg, #f0f8ff, #f0f8ff 3px,#ffe4d9 3px, #ffe4d9 7px);
        background: repeating-linear-gradient(-45deg, #f0f8ff, #f0f8ff 3px,#ffe4d9 3px, #ffe4d9 7px);
    }

    .seat--no-seat {
        background-color: #000000;
    }

    .seat--reserved {
        background-color: #003807;
    }
    .seat--reserved > span {
        color: #3ebd59 !important;
    }

    .seat img {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

        max-width: 100%;
        max-height: 100%;
        height: 100%;
        width: 100%;
        vertical-align: middle;
    }

    .seat > span {
        font-weight: bold;
        color: #cc0000;
    }
    .seat--no-seat > span {
        color: #000000 !important;
    }

    .hasTwitter {
        cursor: pointer;
    }

</style>