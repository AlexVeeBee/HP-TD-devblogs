var nextBackgroundUrl = "";
var nextBackgroundWait = false;
var allowNextBackground = true;
var inNews = false
function goHome() {
    inNews = false;
    if ($(".pageBkg-img .img-bkg").css("opacity") > 0.5) {
        allowNextBackground = false
        nextBackgroundWait = true
        $(".pageBkg-img .img-bkg").animate({
            opacity: 0
        }, 2000,() => {
            nextBackgroundWait = false
            allowNextBackground = true
        })
    }
    console.log(nextBackgroundWait)

    $("body .main-Page .content").empty();
    $("body .main-Page .content").append(`<h1 class="contentLoading">Loading News</h1>`);
    $.getJSON("./news.json", (data) => {
        const nextURL = 'https://alexveebee.github.io/HP-TD-devblogs/docs/';
        const nextTitle = 'Loading';
        const nextState = { additionalInformation: '' };
        window.history.pushState(nextState, nextTitle, nextURL);

        $("body .main-Page .content").empty();
        var ViewIndex = data.length-1
        data.reverse().forEach(function(item, index) {
            $("body .main-Page .content").append(`
            <a tabindex="0" onclick="goToNews(`+ViewIndex+`)" class="blog">
                <div class="blog-inner">
                    <div class="prev-image">
                        <img src="`+item.img+`">
                    </div>
                    <div class="title">
                        <div class="newsReleased">
                            `+item.newsReleased+`
                        </div>
                        <h1>`+item.title+`</h1>
                        <span>`+item.description+`</span>
                    </div>
                </div>
            </a>
            `);
            ViewIndex--
        })
    })
}

function goToNews(id) {
    $("body .main-Page .content").empty();
    $("body .main-Page .content").append(`<h1 class="contentLoading">Loading</h1>`);
    var itemjson
    $.getJSON("./news.json", (data) => {
        var item = data[id]
        itemjson = item
        const nextURL = 'https://alexveebee.github.io/HP-TD-devblogs/?viewNews='+id;
        const nextTitle = 'Loading';
        const nextState = { additionalInformation: '' };
        window.history.pushState(nextState, nextTitle, nextURL);
    }).then(() => {
        inNews = true;
        setTimeout(() => {
            if (allowNextBackground == true) {
                $(".pageBkg-img img").attr("src", itemjson.img);
            }
        }, 2000)
        if(nextBackgroundWait == false) {
            $(".pageBkg-img img").attr("src", itemjson.img);
        }
        nextBackgroundUrl = itemjson.img;
        $(".page-title").html(itemjson.title)
        
        $("body .main-Page .content").load("./htmlNews/"+itemjson.htmlFile, () => {
            $("body .main-Page .content .contentLoading").remove();
            $("body .main-Page .content .devblog-container .NewsTitle[set]").html(itemjson.title)
            $("body .main-Page .content .devblog-container .NewsDescription[set]").html(itemjson.description)
        });
    })
}

$(document).on("load", ".pageBkg audio", () => {
    console.log("loaded")
    this.each(() => {
        this.play();
        console.log("play")
    })
})

$(document).ready(() => {
    $(".pageBkg-img .img-bkg").on("load", () => {
        $(".pageBkg-img .img-bkg").animate({
            opacity: 1
        }, 1000)
    });

//    $(".pageBkg-img").append(`<audio controls class="pageBkg-audio"autoplay><source src="./objects/Audio/Background Music.mp3" type="audio/mp3"></audio>`)
   // $(".pageBkg-img .pageBkg-audio").attr("src","./objects/Audio/Background Music.mp3")

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
        goHome()
    } else {
        goToNews(getUrlParameter("viewNews"))
    }
    $(window).on('popstate', function(e){
        if (!getUrlParameter("viewNews")) {
            goHome()
        } else {
            goToNews(getUrlParameter("viewNews"))
        }
    });
    {
        var currentImgScale = 1

        $(".main-Page .content").on("click", ".devblog-container .devblog-contrubitor-section .devblog-contrubitor-container-made .img-clickable" , ( data ) => {
            $("body").css("overflow", "hidden"); $(".img-container-preview").attr("open", "");
            var elementTarget = data.currentTarget; 
            var img_targert;
            if ($(elementTarget).attr("prevSrc")) {
                img_targert = $(elementTarget).attr("prevSrc");
            } else {
                img_targert = $(elementTarget).attr("src");
            }
            $(".img-container-preview .img-container img").attr("src", img_targert)
            $(".img-container-preview .img-container img").css("opacity", "0.5");
            $(".img-container-preview .img-container img").on("load", () => {
                $(".img-container-preview .img-container img").css("opacity", "1");
                if ($(".img-container-preview .img-container img").width() > $(document).width()-1) {currentImgScale = 0.8; $(".img-container-preview .img-container .inner").css({transform: "scale(0.8)"});}
                if ($(".img-container-preview .img-container img").height() > $(document).height()) {currentImgScale = 0.8; $(".img-container-preview .img-container .inner").css({transform: "scale(0.8)"}); }
            })
        })
        // var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/ ;
        // var scale = $(".img-container-preview .img-container .inner").css("-webkit-transform").match(matrixRegex)
        
        $(".img-container-preview .img-container .inner").draggable({
            scroll: false
        })
        $(".img-container-preview .img-container .inner").on("mousewheel", ( data ) => {
            if (data.originalEvent.deltaY < 1) { if(currentImgScale < 3 ) {currentImgScale += 0.1 } }
            if (data.originalEvent.deltaY > -1) { if(currentImgScale > 0.6 ) { currentImgScale -= 0.1 } }
            $(".img-container-preview .img-container .inner").css({transform: "scale("+currentImgScale+")"});
        })
    }
    $(".img-container-preview .exit-preview").on("click", ( data ) => {
        $(".img-container-preview").removeAttr("open")
        $("body").css("overflow", "auto")
        $(".img-container-preview .img-container .inner").css({top: 0, left: 0});
        $(".img-container-preview .img-container .inner").css("transform", "scale(1)");
        currentImgScale = 1
    })
})