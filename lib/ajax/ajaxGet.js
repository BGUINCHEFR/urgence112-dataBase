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
