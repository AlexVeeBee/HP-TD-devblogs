$(document).ready(() => {
    $(".page-header-loading").remove()
    // shhhh, this is copied from stackoverflow | credit: Sameer Kazi   
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };
    // 
    $("body .main-Page .content").empty();
    $("body .main-Page .content").append(`<h1 class="contentLoading">Loading</h1>`);
    if (!getUrlParameter("viewNews")) {
        $(".pageBkg-img").hide();
        $.getJSON("./news.json", (data) => {
            $("body .main-Page .content").empty();
            var ViewIndex = data.length-1
            data.reverse().forEach(function(item, index) {
                $("body .main-Page .content").append(`
                <a href="?viewNews=`+ViewIndex+`" class="blog">
                    <div class="blog-inner">
                        <div class="prev-image">
                            <img src="`+item.img+`">
                        </div>
                        <div class="title">
                            <h1>`+item.title+`</h1>
                            <span>`+item.description+`</span>
                        </div>
                    </div>
                </a>
                `);
                ViewIndex--
            })
        })
    } else {
        $(".pageBkg-img").show();
        $(".pageBkg-img").css("opacity", "0.4");
        var id = getUrlParameter("viewNews")
        var datajson;
        $.getJSON("./news.json", (data) => {
            var item = data[id]
            datajson = item
        }).then(() => {
            $(".pageBkg-img img").attr("src", datajson.img);
            $(".page-title").html(datajson.title)
            
            $("body .main-Page .content").load("./htmlNews/"+datajson.htmlFile, () => {
                $("body .main-Page .content .contentLoading").remove();
                $("body .main-Page .content .devblog-container .NewsTitle[set]").html(datajson.title)
                $("body .main-Page .content .devblog-container .NewsDescription[set]").html(datajson.description)
            });
        })
    }
})