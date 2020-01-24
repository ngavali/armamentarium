var menuikey = [ "Go", "Rust", "DB" , "DS", "Linux", "Math", "About" ];
var menuitem = { "Go":"go", "Rust":"rust", "DB":"db", "DS":"dist. systems", "Linux":"linux", "Math":"math", "About":"about" };
//var menuikey = [ "Go", "Rust", "DB" , "DS", "Linux", "Math", "About" ];
//var menuitem = { "Go":"go", "Rust":"rust", "DB":"db", "DS":"dist. systems", "Linux":"linux", "Math":"math", "About":"about" };
var navigate = [];
var currentI = 0;

_ = function ( objString ) {

	function getDOMObject ( objString ) {
		return document.getElementById(objString);	
	}

	function putIntoDiv ( toPut, divObject ) {
		divObject.innerHTML = toPut;
	}

	function fetchDataPrivate(request) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open(request.method, request.url, true);
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4) {
		        if(xmlhttp.status == 200) {
		            putIntoDiv(xmlhttp.responseText, request.target);
		        }
			else if(xmlhttp.status == 404) {
                            putIntoDiv("Error: Content not found!!!", request.target);
                        }
		    }
		}
		xmlhttp.send(null);
	}

	if ( objString ) {
		return getDOMObject( objString );
	}
	else {
	return { ready : function (myFunction) {
			document.onreadystatechange = function () {
				if(document.readyState === "complete"){
					myFunction();
					}
				}
			},
			loadContent : function (caller, src, target) {

			menuikey.forEach(fix_menu);

			function fix_menu(item, index) {
				_(item.toLowerCase()).classList.remove("activeLink");
			}

			link = src.split("/")[0];
			if ( link === "interests" )
				link = _("about");
			else
				link = _(src.split("/")[0]);

			if ( link!=null ) {
				link.classList.add("activeLink");
			}
		

			_(target).innerHTML = "Loading...";
			_().fetchData({ method : "GET", url : "/"+src+".content", target : _(target)});

			if ( caller !== "roller" ) {
				navigate.push(src);
				console.log(src);
				currentI=navigate.length-1;
			}

			},
		fetchData : function (request) {
				fetchDataPrivate(request);
			},
		getURI : function () {
				return window.location.href.replace(/[^#]+#?/, "");
			},
		rollContent : function ( direction ) {
				if ( currentI+direction >=0 && currentI+direction < navigate.length ) {
					console.log(navigate.length - (currentI+direction));
					currentI+=direction;
					_().loadContent ( "roller", navigate[currentI], "ContentBody" );
					location.href = "/#"+navigate[currentI];
				}
				if ( direction == 0 ) {
					console.log("latest");
					_().loadContent ( "roller", navigate[navigate.length-1], "ContentBody" );
					currentI=navigate.length-1
					location.href = "/#"+navigate[currentI];
				}
			}
		}
	}
}

_().ready(function() {
	menuikey.forEach(create_menu);

	context = _().getURI();

	if ( 0 < context.length ) {
		_().loadContent( null, context, "ContentBody" );
		_(context.split("/")[0]).classList.add("activeLink");
	}

	function create_menu(item, index) {
		var url = window.location.pathname;
		var menuitemdiv = _("menuitem");
		var idname = "";
		var filename = item.toLowerCase()+'.html';
		if ( url.substring(url.lastIndexOf('/')+1) === filename || url.split('/')[1]+'.html' === filename ) {
			idname = "home";
		}
		menuitemdiv.innerHTML = menuitemdiv.innerHTML + '<a href="#'+item.toLowerCase()+'" id="'+item.toLowerCase()+'" class="" onclick="_().loadContent(this,\''+item.toLowerCase()+'\',\'ContentBody\');">'+menuitem[item]+'</a> ';
	//	menuitemdiv.innerHTML = menuitemdiv.innerHTML + '<a href="#'+item.toLowerCase()+'" id="'+item.toLowerCase()+'" id="someid" onclick="_().loadContent(this,\''+item.toLowerCase()+'\',\'ContentBody\');">'+item+'</a> ';
	//	menuitemdiv.innerHTML = menuitemdiv.innerHTML + '<a id="'+idname+'" href="/'+item.toLowerCase()+'.html" onclick="return loadContent("'+item+'");">'+item+'</a> ';
	}
});
