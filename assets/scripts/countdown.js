"use strict"

let parseCountdown = function(t) {
    let time = new Date(t);
    let result = {
        year: time.getUTCFullYear() - 1970,
        month: time.getUTCMonth(),
        date: time.getUTCDate() - 1,
        hour: time.getUTCHours(),
        min: time.getUTCMinutes(),
        s: time.getUTCSeconds()
    };
    return result;
};

$(document).ready(function() {
    window.setInterval(function() {
        $(".countdownDisplay").html(function() {
            let result = "";
            let id = this.closest(".event").id;
            let raw = Date.parse(new Date((new Date($("#" + id).find(".timeValue").html())) - (new Date())));

            if (raw > 0) {
                // not yet, the format should be a countdown no matter what the type of event is
                let time = parseCountdown(raw);
                if (time.year == 1) {
                    result += ("" + time.year + " Year ");
                } else if (time.year != 0) {
                    result += ("" + time.year + " Years ");
                }

                if (time.month == 1) {
                    result += ("" + time.month + " Month ");
                } else if (time.month != 0) {
                    result += ("" + time.month + " Months ");
                }

                if (time.date == 1) {
                    result += ("" + time.date + " Day ");
                } else if (time.date != 0) {
                    result += ("" + time.date + " Days ");
                }

                if (time.hour <= 9) {
                    result += ("0" + time.hour + ":");
                } else {
                    result += (time.hour + ":");
                }

                if (time.min <= 9) {
                    result += ("0" + time.min + ":");
                } else {
                    result += (time.min + ":");
                }

                if (time.s <= 9) {
                    result += ("0" + time.s);
                } else {
                    result += time.s;
                }

                return result;
            } else {
                if ($("#" + id).hasClass("anniversary")) {
                    let raw = Date.parse(new Date((new Date($("#" + id).find(".timeValue").html()).setFullYear((new Date().getFullYear()))) - (new Date())));
                    let time = parseCountdown(raw);
                    let end = "";
                    if (time.year < 0) {
                        $("#" + id).addClass("finished");
                        let orginalTime = time;
                        time = parseCountdown(0 - raw);
                        end = "ago";
                    }
                    // console.log(time);

                    if (time.month == 1) {
                        result += ("" + time.month + " Month ");
                    } else if (time.month != 0) {
                        result += ("" + time.month + " Months ");
                    }

                    if (time.date == 1) {
                        return "Yesterday"
                    } else if (time.date != 0) {
                        result += ("" + time.date + " Days ");
                    }

                    if (time.month == 0 && time.date == 0) {
                        return "Today"
                    }

                    // display the day count from the original date

                    result += end;

                    return result;
                }
                $("#" + id).addClass("finished");
                return "Passed";
            }
        });

        $("#fromToday").html(function() {
            let id = this.closest(".event").id;
            let raw = Date.parse(new Date((new Date($("#" + id).find(".timeValue").html())) - (new Date())));
            if ($("#" + id).hasClass("anniversary") && (new Date(raw)).getTime() < 0) {
                return Math.floor((0 - (new Date(raw)).getTime()) / 86400000) + " days ago";
            }
        });

    }, 1000);
});
