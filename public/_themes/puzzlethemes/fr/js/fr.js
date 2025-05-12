var idSite = document.getElementById('idSite').value;
var localClientInvalidMail = 'Saisissez un Email valide';
if (idSite == 2) {
  var localClientExistingMail = 'Un compte existe avec cet Email - <span style="color:red;" onclick="openModal()" title="S\'identifier">S\'identifier</span>';
} else {
  var localClientExistingMail = 'Un compte existe avec cet Email - <a style="color:red;" href="/clients/" title="S\'identifier">S\'identifier</a>';
}
var localClientInvalidPwd  = 'Saisissez votre mot de passe';
var localClientPwd  = 'Mot de passe';
var localClientInvalidPwd2  = 'La confirmation du mot de passe est incorrecte';
var localClientInvalidND   = 'Numéro de dossier incorrect'; 
var localClientInvalidCP   = 'Code postal incorrect';
var localClientInvalidNom  = 'Le champ est vide';
var localClientInvalidAdr  = 'Le champ doit faire au minimum 5 caractères';
var localClientInvalidVille= 'Le champ ne doit pas être vide';
var localClientInvalidForm = 'Formulaire incomplet';
var localClientInvalidTel  = 'Téléphone obligatoire';
var localClientInvalidTel1  = 'Indiquez au moins';
var localClientInvalidTel2  = 'un numéro de téléphone';
var localClientInvalidCiv  = 'Choisissez la civilité';
var localCGV = 'Vous devez accepter les conditions générales de vente';
var localProduit = 'produit';
var localProduits= 'produits';
var localPrice = '%PRIX% &euro;';
var localFitrePrixDevise = ' \u20AC';
var localFitrePrixDevise0 = '';
var localSupplierMail = 'Vous devez préciser votre choix.';
 
var local_language = 'fr';
var local_pzp_select_image = 'Vous devez choisir une photo : cliquez sur le bouton "Parcourir" ou sur une de vos images déjà chargées.';
var local_pzp_select_date = 'Vous devez choisir une date';
var local_pzp_select_poids = 'Vous devez indiquer un poids';
var local_pzp_select_taille = 'Vous devez indiquer une taille';
var local_pzp_erreur_1 = 'Fichier trop volumineux. Le poids maximal est 30 Mo.';
var local_pzp_erreur_2 = 'Format inconnu. Nous acceptons les principaux formats d\'images et le PDF.';
var local_pzp_erreur_3 = 'La résolution de la photo est trop petite.';
var local_pzp_erreur_4 = 'La résolution de la photo est trop grande : maximum 15 000 x 15 000 pixels.';
var local_pzp_quality = 'Votre photo est trop petite, votre image sera floue : il faut que vous téléchargiez une image avec une meilleure définition et plus grande.';
var local_pzp_annuler = 'Annuler';
var local_pzp_erreur = 'Erreur';
var local_pzp_select_pieces = 'Vous devez choisir un format';
var local_pzp_select_m = 'Vous devez choisir une illustration';
var local_pzp_q0 = 'Insuffisante';
var local_pzp_q1 = 'Trop faible';
var local_pzp_q2 = 'Moyenne';
var local_pzp_q3 = 'Satisfaisante';
var local_pzp_q4 = 'Optimale';
var local_pzp_saisie_default = 'Vous pouvez saisir un texte';
var local_pzp_saisie_reste = 'Vous pouvez encore saisir %NB% caract&egrave;re%X%';
var local_pzp_wait = 'La g&eacute;n&eacute;ration de votre produit peut durer jusqu\'&agrave; 2 minutes. Merci de patienter...';
var local_wait = 'Patientez quelques instants...';
var local_prix = 'Prix';
var local_chrono_day = 'J';
var local_title_coeur_gris = 'Cliquez pour ajouter le produit à la liste';
var local_title_coeur_rouge = 'Cliquez pour retirer le produit de la liste';
var local_err_mode_liv = 'Vous devez choisir un mode de livraison';
var local_err_mode_liv_pr = 'Vous devez choisir un point relais';
var local_err_portable_obligatoire = 'Vous devez indiquer un numéro de téléphone portable';
var local_err_portable_obligatoire_suivi = 'Vous devez indiquer un numéro de téléphone portable pour le suivi SMS';
var local_choix_produit_offre = 'Vous avez déjà choisi le nombre maximum de produits offerts';
var local_choix_produit_offre_new1 = 'Vous n\'avez pas sélectionné le nombre de produits nécessaires dans la liste précédente.';
var local_choix_produit_offre_new2 = 'Vous avez déjà choisi le nombre maximum de produits.';

var local_deb_phrase_info_popup_offre_speciale = 'Vous pouvez encore choisir <span style="color:#FF861E;font-weight:bold;">';
var local_fin_phrase_info_popup_offre_speciale_singulier = 'produit</span> dans cette liste.';
var local_fin_phrase_info_popup_offre_speciale_pluriel = 'produits</span> dans cette liste.';
var local_phrase_info_popup_offre_speciale_selection_impossible = 'Vous ne pouvez plus choisir de produit dans cette liste.';
var local_msg_affiche_ajout_produit_offre_speciale = "Produit ajouté au panier - quantité : ";
var local_msg_affiche_qte_trop_importante = "Vous ne pouvez pas sélectionner autant de quantité.";
var local_msg_affiche_qte_0 = "Veuillez renseigner un stock supérieur à 0.";
var local_nb_exemplaire_max = 'Le maximum est de %NBSTOCK% exemplaire';
var local_nb_exemplaires_max = 'Le maximum est de %NBSTOCK% exemplaires';

var local_j = "j ";
var local_h = "h ";
var local_min = "min ";
var local_s = "s";


var local_msg_cookie = "Les %LIENCOOKIE% assurent le bon fonctionnement de nos services. En utilisant ces derniers, vous acceptez l\'utilisation des %LIENCOOKIE%";
var local_msg_fermer_cookie = "Ne plus voir ce message‏";

var local_selection_modele_pp = "Merci de sélectionner un modèle dans la liste.";

var local_wait_popup = 'Patientez quelques instants...';

var local_msg_erreur_inscription = "Certains éléments de votre adresse ne sont pas valides. Merci de compléter.";

var local_msg_element_non_valides = "Certains éléments ne sont pas valides. Merci de compléter";
var local_msg_saisi_old_mdp = "Saisissez votre ancien mot de passe";
var local_msg_saisi_new_mdp = "Saisissez votre nouveau mot de passe";
var local_msg_confirm_mdp = "Confirmez votre nouveau mot de passe";
var local_msg_message_oblig = "Veuillez renseigner un message";

var local_lien_marge_securite = "Marges de sécurité";
var local_msg_marge_securite = "Tout ce qui dépasse des marges de sécurité risque d\'être coupé pendant le processus de découpe.";


// photo puzzle client
var local_selection_puzzle_liste = "Sélectionner votre puzzle";
var local_question_suppr_photo = "Etes-vous sur de vouloir supprimer cette photo ?";
var local_question_suppr_upload = "Etes-vous sur de vouloir supprimer cette saisie ?";
var local_deb_msg_afficher_puzzle_sur_produit_1 = "Masquer la gallerie des clients";
var local_deb_msg_afficher_puzzle_sur_produit_2 = "Afficher la gallerie des clients";
var local_choix_autre_liste_emplacement = "Autre";
var local_caractere_restant = "caractères restants";

var local_msg_erreur_droit = "Veuillez autoriser Planet'Puzzles à diffuser vos photos sur le site.";
var local_msg_erreur_client = "Vous n'êtes pas reconnu en tant que client du site. Veuillez vous reconnecter.";
var local_msg_erreur_produit = "Veuillez sélectionner un puzzle parmis la liste proposée.";
var local_msg_erreur_difficulte = "Veuillez sélectionner la difficulté de réalisation du votre puzzle en cliquant sur une des étoiles.";
var local_msg_erreur_temps = "Veuillez renseigner le temps de réalisation.";
var local_msg_erreur_emplacement = "Veuillez précise l'emplacement du puzzle.";
var local_msg_erreur_detail_emplacement = "Veuillez nous préciser plus en détail l'emplacement.";
var local_msg_erreur_photo = "Veuillez sélectionner au moins une photo de votre puzzle.";
var local_msg_erreur_photo_trop = "Vous avez sélectionné trop de photos...";
var local_msg_erreur_selection_file = "Il existe une ou des erreurs concernant vos photos. Veuillez vérifier.";

var local_msg_erreur_au_moins_1_photo = "Veuillez sélectionner des photos de votre puzzle.";
var local_msg_erreur_suppr_upload = "Erreur lors de la suppression de la saisie.";
var local_msg_erreur_suppr_img = "Erreur lors de la suppression de l'image.";

var local_msg_erreur_upload_existe_deja = "Il existe déjà une saisie sur ce puzzle.";

var local_msg_del_pp = "Supprimer ce puzzle ?";
