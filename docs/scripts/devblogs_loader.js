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
        var itemjson;
        $.getJSON("./news.json", (data) => {
            var item = data[id]
            itemjson = item
        }).then(() => {
            $(".pageBkg-img img").attr("src", itemjson.img);
            $(".page-title").html(itemjson.title)
            
            $("body .main-Page .content").load("./htmlNews/"+itemjson.htmlFile, () => {
                $("body .main-Page .content .contentLoading").remove();
                $("body .main-Page .content .devblog-container .NewsTitle[set]").html(itemjson.title)
                $("body .main-Page .content .devblog-container .NewsDescription[set]").html(itemjson.description)
                $(".main-Page .content .devblog-container").on("click", ".devblog-contrubitor-section .devblog-contrubitor-container-made .img-clickable" , ( data ) => {
                    $("body").css("overflow", "hidden"); $(".img-container-preview").attr("open", "");
                    var elementTarger = data.currentTarget; var img_targert = $(elementTarger).attr("src");
                    $(".img-container-preview .img-container img").attr("src", img_targert);
                })
                {
                    var currentImgScale = 1
                    // var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/ ;
                    // var scale = $(".img-container-preview .img-container .inner").css("-webkit-transform").match(matrixRegex)

                    $(".img-container-preview .img-container .inner").on("mousewheel", ( data ) => {
                        if (data.originalEvent.deltaY < 1) { if(currentImgScale < 3 ) {currentImgScale += 0.1 } }
                        if (data.originalEvent.deltaY > -1) { if(currentImgScale > 0.6 ) { currentImgScale -= 0.1 } }
                        $(".img-container-preview .img-container .inner").css({transform: "scale("+currentImgScale+")"});
                    })
                    // Shhh this is copied from stackoverflow | credit: user982671, Avatar   
                    function handle_mousedown(e){

                        window.my_dragging = {};
                        my_dragging.pageX0 = e.pageX;
                        my_dragging.pageY0 = e.pageY;
                        my_dragging.elem = this;
                        my_dragging.offset0 = $(this).offset();
                    
                        function handle_dragging(e){
                            var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
                            var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
                            $(my_dragging.elem)
                            .offset({top: top, left: left});
                        }
                    
                        function handle_mouseup(e){
                            $('body')
                            .off('mousemove', handle_dragging)
                            .off('mouseup', handle_mouseup);
                        }
                    
                        $('body')
                        .on('mouseup', handle_mouseup)
                        .on('mousemove', handle_dragging);
                    }
                    // 
                    
                    $(".img-container-preview .img-container .inner").on("mousedown", handle_mousedown)
                }
                $(".img-container-preview .exit-preview").on("click", ( data ) => {
                    $(".img-container-preview").removeAttr("open")
                    $("body").css("overflow", "auto")
                    $(".img-container-preview .img-container .inner").css({top: 0, left: 0});
                    $(".img-container-preview .img-container .inner").css("transform", "scale(1)");
                    currentImgScale = 1
                })
                $()
            });
        })
    }
})