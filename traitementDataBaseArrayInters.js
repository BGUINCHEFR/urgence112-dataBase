// Pour faire court, à quoi sert ce script, c'est pour une base de donnée exel, c'était trop le bordel, c'est la base de tt les inters, faut partir d'une bonne base.

// C'est sensé afficher un tableau ou quand ils cliqueront sur une case, ça afficheras un input ou ils écriront ce qu'ils veulent, et quand ils auront validés, ça actuliseras la base de données.
var tableDataBaseInters = document.getElementById('tableDataBaseInters');
var modification = false; // Bool on/of qui vérifie si une modif est en cours sur une case
var value; // Une valeur temporaire qui change tt le temps
var ajoutLigneEnCours = false; // Encore un bool, mais la c'est pour l'ajout d'une ligne
// Fonction qui récup les données
JSONfileGet("http://localhost/urgence112/interventionsDataBase/arrayInters.json", function(data)
{
	// Appelle la fonction objectDataBase.forEach qui permet d'afficher le tableau dans la page html
	data.forEach(function(dataLigne)
	{
		objectDataBase.ajouterLigne(dataLigne);
	})
});
//Fonction servant a faire des manipulations sur la base de donnée(ajouter/créer un object/exporter...)
objectDataBase = 
{	// Crée un nouvel object
	init: function(titre, description, vehicules, revenu, types)
	{
		let ligneObject = new Object();
		ligneObject.titre = titre;
		ligneObject.description = description;
		ligneObject.vehicules = vehicules;
		ligneObject.revenu = revenu;
		ligneObject.types = types;
		return ligneObject;
	},
	/*Met en forme les données dans un tableau html permettant de afficher les inters */
	ajouterLigne: function(dataLigne)
	{
		let ligne = document.createElement('tr'); // Crée la ligne ou on ajoute les cases dedans
		nomElt = document.createElement('td');// Crée la case
		nomElt.textContent = dataLigne.titre; //Ajoute le txt de la base de donnée dans la case
		verifCaseRouges(nomElt); // vérifie si c'est vide, voir plus bas pour ce que ça fait
		ligne.appendChild(nomElt);// Ajoute la case dans la ligne
		// même chose pour les autres
		let descriptionElt = document.createElement('td');
		descriptionElt.textContent = dataLigne.description;
		verifCaseRouges(descriptionElt);
		ligne.appendChild(descriptionElt);
		let vehiculesElt = document.createElement('td');
		vehiculesElt.textContent = dataLigne.vehicules;
		verifCaseRouges(vehiculesElt);
		ligne.appendChild(vehiculesElt);
		let revenuElt = document.createElement('td');
		revenuElt.textContent = dataLigne.revenu;
		verifCaseRouges(revenuElt);
		ligne.appendChild(revenuElt);
		let typesElt = document.createElement("td");
		typesElt.textContent = dataLigne.types;
		verifCaseRouges(typesElt);
		ligne.appendChild(typesElt);
		tableDataBaseInters.appendChild(ligne);//met la ligne dans le tableau
	},
	export: function() // Exporte le tableau sous un autre fichier format JSON
	{
		let tableau = new Array();
		for(i=0; i < document.getElementsByTagName("tr").length; i++)
		{
			console.log(i);
			tableau.push(objectDataBase.init(
				document.getElementsByTagName("tr")[i].childNodes[0].textContent,
				document.getElementsByTagName("tr")[i].childNodes[1].textContent,
				document.getElementsByTagName("tr")[i].childNodes[2].textContent,
				document.getElementsByTagName("tr")[i].childNodes[3].textContent,
				document.getElementsByTagName("tr")[i].childNodes[4].textContent))
		}
		ajaxPost("http://localhost/urgence112/interventionsDataBase/test.json", tableau, function(reponse)
		{
			console.log(reponse)
		}, true)
		console.log(tableau);
	}
}

function verifCaseRouges(Elt) // Si une case est vide, ça colore en rouge pour completer
{
	if (Elt.textContent === "") 
	{
		Elt.style.backgroundColor = "#ff6666";
	}
}

$(function()
{
	// Modifs de base
	$('div#infosLignetableDataBaseIntersAjouterLigne').hide()
	// Quand on clique sur une case, sa génère un input et
	$('td').click(function()
	{
		if (!modification) 
		{
		setTimeout(function(){modification = true},100) // je ajoute du temps juste de quoi le code charge pour que l'event ('tr','click') se charge
		let eltModification = $(this);// L'élément modifié
		value = $(this).text();//texte de la case
		$(this)
		.text("")//vide la case
		.prepend($('<input id="inputModificationTableInters">').val(value))//met un imput et met comme valeur ce qui était dans la case
		.append($('<button id="boutonModificationTableInters">modifier</button>').click(function() // Et puis un bouton pour valider
		{
			eltModification.text($('input#inputModificationTableInters').val())// met le texte du imput dans la case
			.css('background', '#006600') // met la case en vert
			$('button#deleteLigneButton').remove() 
			setTimeout(function(){modification = false},1000) // pareil, je ajoute du temps juste de quoi le code charge
		}))
		}
	})
	$('tr').click(function()
	{
		{	if (!modification) 
			{
				ligne = $(this)
				$(this).append($('<button id="deleteLigneButton">Supprimer</button>').click(function() // Ajoute le bouton supprimer quand la ligne cliquée
				{
					ligne.remove(); 
					modification = false;
				}))	
			}
		}
	})
	$('button#tableDataBaseIntersAjouterLigne').click(function()
	{
		if (!ajoutLigneEnCours) 
		{
			ajoutLigneEnCours = true;
			$('div#infosLignetableDataBaseIntersAjouterLigne').show(500); // affiche le formulaire
			$(this).text("Ajouter");
			
		}
		else if (ajoutLigneEnCours) 
		{
			$(this).text("Ajouter une ligne");
			$('div#infosLignetableDataBaseIntersAjouterLigne').hide(500); 
			// la fonction dessous c'est compliqué à comprendre comme ça, mais ça crée un object a partir des valeurs des imputs, et ajoute cet object dans le tableau.
			objectDataBase.ajouterLigne(objectDataBase.init($('div#infosLignetableDataBaseIntersAjouterLigne input')[0].value, $('div#infosLignetableDataBaseIntersAjouterLigne input')[1].value
			, $('div#infosLignetableDataBaseIntersAjouterLigne input')[2].value, $('div#infosLignetableDataBaseIntersAjouterLigne input')[3].value, $('div#infosLignetableDataBaseIntersAjouterLigne input')[4].value));
			$('div#infosLignetableDataBaseIntersAjouterLigne input').val('')
			ajoutLigneEnCours = false;
		}
	})
})
