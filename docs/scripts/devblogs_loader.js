$(document).ready(() => {
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
    if (!getUrlParameter("viewNews")) {
        $(".pageBkg-img").hide();
        $.getJSON("./news.json", (data) => {
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
        $.getJSON("./news.json", (data) => {
            var item = data[id]
            $(".pageBkg-img img").attr("src", item.img);
            $("body .main-Page .content").load("./htmlNews/"+item.htmlFile, () => {
                $("body .main-Page .content .devblog-container .NewsTitle[set]").html(item.title)
                $("body .main-Page .content .devblog-container .NewsDescription[set]").html(item.description)
            });
        })
    }
})