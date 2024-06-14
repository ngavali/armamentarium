var menuikey = ["Go", "Rust", "DB", "DS", "Linux", "Math", "Random", "About"];
var menuitem = {"Go": "go", "Rust": "rust", "DB": "db", "DS": "dist. systems", "Linux": "misc", "Math": "math", "Random": "random", "About": "about"};
//var menuikey = [ "Go", "Rust", "DB" , "DS", "Linux", "Math", "About" ];
//var menuitem = { "Go":"go", "Rust":"rust", "DB":"db", "DS":"dist. systems", "Linux":"linux", "Math":"math", "About":"about" };
var navigate = [];
var currentI = 0;
var reading = false;
var fontSelection = {true: "myfont", false: "'Helvetica Neue',Helvetica,Arial,sans-serif"};
var readingSource = {true: "/static/book-active.png", false: "/static/book-inactive.png"}
var readingActive = {true: "green", false: "black"}

function toggleFont() {
    reading = !getReadingMode()
    fixFont(reading)
    setCookie("reading_mode", reading, 7)
}

function getReadingMode() {
    let reading_mode = getCookie("reading_mode")
    if (reading_mode != "") {
        reading = (reading_mode == 'true')
        return reading
    }
    return false
}

function fixFont(reading) {
    _('topicContent').style.fontFamily = fontSelection[reading];
    _('topicContent').style.fontWeight = reading ? "bold" : "normal";
    _('reader').color = readingActive[reading];
}

function setCookie(cookie_name, cookie_value, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = "expires=" + d.toUTCString()
    document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/"
}

function getCookie(cookie_name) {
    var name = cookie_name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

_ = (objString) => {

    function getDOMObject(objString) {
        return document.getElementById(objString);
    }

    function putIntoDiv(toPut, divObject) {
        try {
            let frag = document.createRange().createContextualFragment(toPut);
            divObject.innerHTML = '';
            divObject.appendChild(frag);
        } catch (ex) {
            console.log("Couldnt convert content to DOM due to exception: " + ex);
            console.log("Falling back to text mode");
            divObject.innerHTML = toPut;
        }
    }

    function fetchDataPrivate(request, callback, args) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(request.method, request.url + ".content", true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    putIntoDiv(xmlhttp.responseText, request.target);
                    if (callback != null) {
                        callback(args)
                    }
                    //window.history.pushState({"html":xmlhttp.responseText,"pageTitle":""},"", "#"+request.url.substring(1));
                }
                else if (xmlhttp.status == 404) {
                    putIntoDiv("Error: Content not found!!!", request.target);
                }
            }
        }
        xmlhttp.send(null);
    }

    if (objString) {
        return getDOMObject(objString);
    }
    else {
        return {
            ready: (myFunction) => {
                document.onreadystatechange = function () {
                    if (document.readyState === "complete") {
                        myFunction();
                    }
                }
            },
            fixLinks: function (where) {

                var links = document.getElementById(where).getElementsByTagName("a")

                for (var i = 0; i < links.length; i++) {

                    if (links[i].getAttribute("href").match(/^#/gi)) { //skip root 

                        //console.log("link updated->", links[i].getAttribute("href").substring(1))

                        links[i].addEventListener("click", function (e) {
                            //prevent event action
                            e.preventDefault();
                            _().loadContentXp(links[i], this.getAttribute("href").substring(1), 'ContentBody')
                        })
                    }
                }

            },
            loadContentXp: function (caller, src, target) {

                menuikey.forEach(fix_menu);

                function fix_menu(item, index) {
                    _(item.toLowerCase()).classList.remove("activeLink");
                }

                link = src.split("/")[0];
                if (link === "interests")
                    link = _("about");
                else
                    link = _(src.split("/")[0]);

                if (link != null) {
                    link.classList.add("activeLink");
                }

                //console.log('fetching links...', src)
                window.location = "#" + src;
                _(target).innerHTML = "Loading...";
                _().fetchData({method: "GET", url: "/" + src, target: _(target)}, _().fixLinks, 'ContentBody');


                if (caller !== "roller") {
                    navigate.push(src);
                    //console.log(src);
                    currentI = navigate.length - 1;
                }

            },
            fetchData: function (request, callback, args) {
                //console.log("fetchdata ->> ", args)
                fetchDataPrivate(request, callback, args);
            },
            getURI: function () {
                return window.location.href.replace(/[^#]+#?/, "")
            },
            rollContent: function (direction) {
                if (currentI + direction >= 0 && currentI + direction < navigate.length) {
                    console.log(navigate.length - (currentI + direction));
                    currentI += direction;
                    _().loadContent("roller", navigate[currentI], "ContentBody")
                    location.href = "/#" + navigate[currentI];
                }
                if (direction == 0) {
                    console.log("latest");
                    _().loadContent("roller", navigate[navigate.length - 1], "ContentBody")
                    currentI = navigate.length - 1
                    location.href = "/#" + navigate[currentI];
                }
            }
        }
    }
}

_().ready(function () {

    menuikey.forEach(create_menu);

    context = _().getURI();

    if (0 < context.length) {
        _().loadContentXp(null, context, "ContentBody");
        _(context.split("/")[0]).classList.add("activeLink");
    }

    _().fixLinks('menubar')
    _().fixLinks('ContentBody')

    function create_menu(item, index) {
        var url = window.location.pathname;
        var menuitemdiv = _("menuitem");
        var idname = "";
        var filename = item.toLowerCase() + '.html';
        if (url.substring(url.lastIndexOf('/') + 1) === filename || url.split('/')[1] + '.html' === filename) {
            idname = "home";
        }
        menuitemdiv.innerHTML = menuitemdiv.innerHTML + '<a href="#' + item.toLowerCase() + '" id="' + item.toLowerCase() + '" class="">' + menuitem[item] + '</a> ';
        //	menuitemdiv.innerHTML = menuitemdiv.innerHTML + '<a href="#'+item.toLowerCase()+'" id="'+item.toLowerCase()+'" id="someid" onclick="_().loadContent(this,\''+item.toLowerCase()+'\',\'ContentBody\');">'+item+'</a> ';
        //	menuitemdiv.innerHTML = menuitemdiv.innerHTML + '<a id="'+idname+'" href="/'+item.toLowerCase()+'.html" onclick="return loadContent("'+item+'");">'+item+'</a> ';
    }

    fixFont(getReadingMode())
    //Collapsable content
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

});


