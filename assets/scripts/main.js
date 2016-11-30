"use strict"

var parseCountdown = function(t) {
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
            let raw = parseInt($("#" + id).find(".countdownValue").html());
            raw = parseInt(raw / 1000) * 1000;
            $("#" + id).find(".countdownValue").html(raw - 1000);
            if (raw > 0) {
                let time = parseCountdown(raw);
                if (time.year != 0) {
                    result += ("" + time.year + " Year ");
                }
                if (time.month != 0) {
                    result += ("" + time.month + " Month ");
                }
                if (time.date != 0) {
                    result += ("" + time.date + " Day ");
                }
                if (time.hour != 0) {
                    result += ("" + time.hour + ":");
                }
                result += ("" + time.min + ":");
                result += ("" + time.s);
                return result;
            } else {
                $("#" + id).addClass("finished");
                return "Now";
            }

        });
    }, 1000);

    $(".countdownDisplay").html(function() {
        let result = "";
        let id = this.closest(".event").id;
        let raw = parseInt($("#" + id).find(".countdownValue").html());
        $("#" + id).find(".countdownValue").html(raw - 10);
        let time = parseCountdown(raw);
        if (time.year != 0) {
            result += ("" + time.year + " Year ");
        }
        if (time.month != 0) {
            result += ("" + time.month + " Month ");
        }
        if (time.date != 0) {
            result += ("" + time.date + " Day ");
        }
        if (time.hour != 0) {
            result += ("" + time.hour + " Hour ");
        }
        result += ("" + time.min + " Min ");
        result += ("" + (59 - (new Date()).getSeconds()) + "S");
        return result;
    });
    // $(".commentBar").hide();
    $("#titleEntry").on("click", function() {
        $("#timeRow").hide();
        // $("#addTable").addClass("expandUp");
        $("#titleEntry").prop("placeholder", "Title");
        $("#feeds").css("margin-top", "250px");
        $("#addTable").show();
        $("#addTable").css({
            "height": "160",
            "padding": "20 20"
        });
        $('html').one('click', function() {
            $("#titleEntry").prop("placeholder", "New Event");
            $("#feeds").css("margin-top", "10px");
            $("#addTable").css({
                "height": "0px"
            });
            $("#addTable").hide();
            $("#addTable").css({
                "padding": "0 20"
            });
        });
        event.stopPropagation();
    });

    $("#addTable").on("click", function() {
        event.stopPropagation();
    });

    $("#typeD").focus(function() {
        $("#addTable").css({
            "height": "182",
            "padding": "20 20"
        });
        $("#timeRow").show();
    });
    $("#typeA").focus(function() {
        $("#timeRow").hide();
        $("#addTable").css({
            "height": "160",
            "padding": "20 20"
        });
        $("#timeRow").find("input").val("00:00");
    });

    $(".doComment").on("click", function(e) {
        let id = this.closest(".event").id;
        $("#" + id).children(".commentBar").css({
            "height": "60",
            "border-top": "1px solid #efefef"
        });
        $("#" + id).find(".doComment").addClass("closeComment");
        $("#" + id).find(".doComment").removeClass("doComment");
        // $("#" + id).children(".doComment").one('click', function() {
        //     console.log("one click");
        //     $("#" + id).children(".commentBar").css("height", "0");
        // });
    });

    $(".closeComment").on("click", function(e) {
        let id = this.closest(".event").id;
        $("#" + id).children(".commentBar").css({
            "height": "0",
            "border-top": "1px solid #FFFFFF"
        });
        $("#" + id).find(".closeComment").addClass("doComment");
        $("#" + id).find(".closeComment").removeClass("closeComment");
        // $("#" + id).children(".doComment").one('click', function() {
        //     console.log("one click");
        //     $("#" + id).children(".commentBar").css("height", "0");
        // });
    });

    $(".moreComment").on("click", function() {
        let id = this.closest(".event").id;
        $.ajax({
            url: '/event',
            type: 'get',
            dataType: "text",
            contentType: "text",
            data: "event=" + id,
        });
    });

    // $("#newEvent").submit(function(e) {
    //     e.preventDefault();
    //
    //     let newEvent = {};
    //     newEvent.title = $("#titleEntry").val();
    //     newEvent.time = $("#timeEntry").val();
    //     newEvent.type = $("input[name=type]:checked").val();
    //     newEvent.private = $("input[name=private]:checked").val();
    //     let newReq = {};
    //     newReq.user = "583907353f48805ef162143a";
    //     newReq.event = newEvent;
    //     $.post('/event', newReq);
    //     // location.reload(false);
    // });

    $("#cancelAdd").on("click", function() {

        $("#titleEntry").prop("placeholder", "New Event");
        $("#feeds").css("margin-top", "10px");
        $("#addTable").css({
            "height": "0px",
            "padding": "0 20"
        });
    });

    $(".commentEntry").on("submit", function(e) {
        e.preventDefault();
        let comment = {};
        let id = this.closest(".event").id;
        console.log("commenting event id: " + id);
        comment.content = $("#" + id).find("input[name=content]").val()
        comment.event = id;
        $.ajax({
            url: "/comment",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(comment),
            // data:comment,
            success: function(res) {
                let newComment = $('<div>');
                newComment.id = res.comment._id;
                newComment.addClass("comment");
                newComment.addClass("animate-opacity");
                let owner = $('<span>');
                owner.addClass("commentOwner");
                let strong = $("<strong>");
                strong.html(res.comment.owner + ": ");
                owner.append(strong);
                newComment.append(owner);
                newComment.append(res.comment.content);
                let timestamp = $("<span>")
                timestamp.addClass("timestamp");
                let time = new Date(parseInt(res.comment._id.toString().substring(0, 8), 16) * 1000);
                timestamp.html("" + time.getFullYear() + "-" +
                    (time.getMonth() + 1) + "-" +
                    time.getDate() + " " +
                    time.getHours() + ":" +
                    time.getMinutes());
                newComment.append(timestamp);
                let deleteButton = $("<button>");
                deleteButton.addClass("deleteComment");
                deleteButton.html("Delete")
                newComment.append(deleteButton);
                //     <span class="commentOwner"><strong>{{comment.owner}}: </strong></span>{{comment.content}} {% if session.event_owner == session.username %}
                //     <span class="timestamp">
                //             {{comment.timestamp.getFullYear()}}-{{comment.timestamp.getMonth() + 1}}-{{comment.timestamp.getDate()}} {{comment.timestamp.getHours()}}:{{comment.timestamp.getMinutes()}}
                //         </span>
                //     <button class="deleteComment">Delete</button> {% elif comment.owner == session.username %}
                //     <button class="deleteComment">Delete</button> {% endif %}
                // </div>
                $("#comments").prepend(newComment);
                $("#" + id).find(".commentButtonText").html(res.count + " Comments");
                $("#" + id).find("input[name=content]").val("");
            }
        });
    });

    $(".doPlus1").on("click", function(e) {
        e.preventDefault();
        let id = this.closest(".event").id;
        $.ajax({
            url: "/plusone",
            type: "POST",
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                event: id
            }),
            success: function(res) {
                console.log(res);
                let value = parseInt(res);


                if (value > 0) {
                    $("#" + id).find(".plus1ButtonText").html(value);
                    $("#" + id).find(".doPlus1").addClass("liked");
                } else {
                    $("#" + id).find(".plus1ButtonText").html(0 - value);
                    $("#" + id).find(".doPlus1").removeClass("liked");
                }
            }

        });
    })

    $(".getEvent").on("click", function(e) {
        let id = this.closest(".event").id;
        $.ajax({
            url: "/event?event=" + id,
            type: "GET",
            dataType: "html",
            // contentType: "application/json; charset=utf-8",
            // data:comment,
            success: function(res) {
                $(document.body).html(res);
            }
        });
        // $.get("/event?event=" + id);
        //  window.reload("/event?event=" + id);
    });


    // let events = $(".animate-opacity");
    // for (var i = 0; i < events.length; i++) {
    //     events[i].delay(i * 1000);
    // }

    // $(".topBar").on("scroll", function(e) {
    //
    //     if (this.scrollTop > 147) {
    //         $(".topBar").addClass("fix-search");
    //     } else {
    //         $(".topBar").removeClass("fix-search");
    //     }
    // });
    // $("button").click(function(){
    //     $("#div1").delay("slow").fadeIn();
    //     $("#div2").delay("fast").fadeIn();
    //     $("#div3").delay(800).fadeIn();
    //     $("#div4").delay(2000).fadeIn();
    //     $("#div5").delay(4000).fadeIn();
    //   });
    // $.post('/events');
    // Stuff to do as soon as the DOM is ready
});
