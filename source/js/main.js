function clickTreeDirectory(){$(document).on("click","#categories .category-item .category-name",function(e){let t=$(this).children(".icon-plus"),n=$(this).parent().next(".sub-cat");t.hasClass("open")?(t.removeClass("open"),n.slideUp({duration:200})):(t.addClass("open"),n.slideDown({duration:200}))})}function focus(){$(".search .search-input").bind("focus",function(e){getSearch($(".search .search-input"))})}function getSearch(e){$.ajax({url:"/search.json",dataType:"json",success:function(t){e.bind("input propertychange",function(e){searcher(t,e.currentTarget.value)})}})}function searcher(e,t){let s=t.trim().toLowerCase();if(s.length<=0)return $("#search-page .search-list").removeClass("show").addClass("none"),void $("#body").show();_search=$("#search-page .search-list"),_search.empty();let c=0,a=s.split(/\s+/);a=uniqueArr(a);let i=a.join("|");e.forEach(t=>{let e=t.title;if((o=uniqueArr(o=e.match(new RegExp(i,"ig"))))&&o.length===a.length){c++,$("#body").css({display:"none"}),_search.removeClass("none").addClass("show"),e=e.replace(new RegExp(i,"ig"),"<strong>$&</strong>"),e=strUpperCase(labelUpperCase(e));var n=matchContent(t.content,s),r=getTime(t.url);const html=renderHtml(e,n,t.url,r);_search.prepend(html)}else{$("#body").css({display:"none"}),_search.removeClass("none").addClass("show");let e=t.content.replace(/<[^>]+>/gi,"");var o=e.match(new RegExp(i,"ig"));o&&(o=uniqueArr(o)).length===a.length&&(c++,n=e.search(new RegExp(i,"ig")),r=wordsContext(e,i,n),o=strUpperCase(t.title),n=getTime(t.url),html=renderHtml(o,r,t.url,n),_search.prepend(html))}}),0===c&&_search.prepend(`
            <div class="text-center py-5 my-5">
                <p style="font-size:2rem">Sorry!<p>
                <p class="text-gray"> 
                    没有你要找的内容。 
                </p>
            </div>
        `)}function matchContent(e,t){let n=e.replace(/<[^>]+>/gi,"");e=n.search(new RegExp(t,"i"));return 0<=e?wordsContext(n,t,e):content=n.substr(0,120)}function checkWords(e,t){let n=e.replace(/<[^>]+>/gi,"");return n.search(new RegExp(t,"i"))}function wordsContext(e,t,n){let r=n-60,o=n+60;r<0&&(r=0,o=120);let s=e.slice(r,o);return s.replace(new RegExp(t,"ig"),"<strong>$&</strong>")}function labelUpperCase(e){var t="<strong>";return 0===e.indexOf(t)&&(subStr=e.substr(t.length),e=t+subStr.charAt(0).toUpperCase()+subStr.slice(1)),e}function strUpperCase(e){var n=e.split("");for(let e=0,t=n.length;e<t;e++)(0===e||-1!=n[e-1].search(/[\s-|\u4e00-\u9fa5]+/g))&&(n[e]=n[e].toUpperCase());return n.join("")}function getTime(e){return e.substr(1,11).replace(/\//g,"-")}function uniqueArr(e){if(e)return e.filter(function(e,t,n){return n.indexOf(e.toLowerCase())===t})}function renderHtml(e,t,n,r){return`
        <div class="post-list">
            <h1><a class="title" style="font-family: monospace;" href="${n}"> ${e} </a></h1>      
            <a class="text-none" href="${n}">
                <div class="post my-3">
                    ${t}
                    <span class="font-sm">  ...<span>       
                </div>
            </a>
            <div class="font-sm mb-5">
                ${r}
            </div>
        </div>`}function directoryIndex(){$("#dir").length&&tocbot.destroy(),tocbot.init({tocSelector:"#dir",contentSelector:"#article",headingSelector:"h1, h2, h3",scrollSmooth:!0,hasInnerContainers:!0,orderedList:!1})}function scrollPage(){200<document.body.scrollTop||200<document.documentElement.scrollTop?$("#up-top").css({opacity:1,bottom:"0.8rem"}):$("#up-top").css({opacity:0,bottom:"-3rem"})}function goTop(){$("#up-top").on("click",function(){$("body, html").animate({scrollTop:document.body.scrollTop=0},500)})}$(document).ready(function(){clickTreeDirectory(),focus(),goTop(),directoryIndex()}),$(window).on("scroll",function(e){scrollPage()});