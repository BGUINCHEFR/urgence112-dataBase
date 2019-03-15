// Convert a JSON file with the 2 functions
//GET
	//get a JSON file with a url
	function ajaxGet(url, callback)
	{
		var requete = new XMLHttpRequest();
		requete.open("GET", url);
		requete.addEventListener("load", function() {
			if (requete.status >= 200 && requete.status < 400) {
				callback(requete.responseText);
			}
			else
			{
				console.error(requete.status + " " + requete.statusText + " " + url);	
			}
		});
		requete.addEventListener("error", function()
		{
			console.log("Erreur réseau avec l'URL " + url);
		});
		requete.send(null)
	}
	// JSON -----> Javascript Object
	function parseJSON(file, callback)
	{
		callback(JSON.parse(file));
	}
	// get a JSON file with url and convert to a javascript object
	// Get --> JSON ---> Javascript Object
	function JSONfileGet(url, callback)
	{
		ajaxGet(url, function(file){
				parseJSON(file, function() {
					callback(JSON.parse(file));
				});
			});
	}
// SEND
	// send a data to a url
	function ajaxPost(url, data, callback) {
	    var req = new XMLHttpRequest();
	    req.open("POST", url);
	    req.addEventListener("load", function () {
	        if (req.status >= 200 && req.status < 400) {
	            // Appelle la fonction callback en lui passant la réponse de la requête
	            callback(req.responseText);
	        } else {
	            console.error(req.status + " " + req.statusText + " " + url);
	        }
	    });
	    req.addEventListener("error", function () {
	        console.error("Erreur réseau avec l'URL " + url);
	    });
	    req.send(data);
	}