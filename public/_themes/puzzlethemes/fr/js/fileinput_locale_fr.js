/*!
 * FileInput French Translations
 *
 * This file must be loaded after 'fileinput.js'. Patterns in braces '{}', or
 * any HTML markup tags in the messages must not be converted or translated.
 *
 * @see http://github.com/kartik-v/bootstrap-fileinput
 *
 * NOTE: this file must be saved in UTF-8 encoding.
 */
(function ($) {
    "use strict";

    $.fn.fileinputLocales['fr'] = {
        fileSingle: 'photo',
        filePlural: 'photos',
        browseLabel: 'Parcourir&hellip;',
        removeLabel: 'Tout supprimer',
        removeTitle: 'Retirer les photos sélectionnées',
        cancelLabel: 'Annuler',
        cancelTitle: "Annuler l'envoi en cours",
        uploadLabel: 'Transférer',
        uploadTitle: 'Transférer les photos sélectionnées',
        msgZoomTitle: 'Voir les détails',
        msgZoomModalHeading: 'Aperçu détaillé',
        msgSizeTooLarge: 'La photo "{name}" (<b>{size} KB</b>) dépasse la taille maximale autorisée qui est de <b>{maxSize} KB</b>.',
        msgFilesTooLess: 'Vous devez sélectionner au moins <b>{n}</b> {files} à transmetter.',
        msgFilesTooMany: 'Le nombre de photo sélectionnée <b>({n})</b> dépasse la quantité maximale autorisée qui est de <b>{m}</b>.',
        msgFileNotFound: 'La photo "{name}" est introuvable !',
        msgFileSecured: "Des restrictions de sécurité vous empêchent d'accéder à la photo \"{name}\".",
        msgFileNotReadable: 'La photo "{name}" est illisble.',
        msgFilePreviewAborted: 'Prévisualisation de la photo "{name}" annulée.',
        msgFilePreviewError: 'Une erreur est survenue lors de la lecture de la photo "{name}".',
        msgInvalidFileType: 'Type de document invalide pour "{name}". Seulement les documents de type "{types}" sont autorisés.',
        msgInvalidFileExtension: 'Extension invalide pour la photo "{name}". Seules les extensions "{extensions}" sont autorisées.',
        msgUploadAborted: 'Le téléchargement de la photo a été interrompue',
        msgValidationError: 'Erreur lors de la transmission de la photo',
        msgLoading: 'Transmission de la photo {index} sur {files}&hellip;',
        msgProgress: 'Transmission de la photo {index} sur {files} - {name} - {percent}% faits.',
        msgSelected: '{n} {files} sélectionné(s)',
        msgFoldersNotAllowed: 'Glissez et déposez uniquement des photos ! {n} répertoire(s) exclu(s).',
        msgImageWidthSmall: 'Largeur de fichier image "{name}" doit être d\'au moins {size} px.',
        msgImageHeightSmall: 'Hauteur de fichier image "{name}" doit être d\'au moins {size} px.',
        msgImageWidthLarge: 'Largeur de fichier image "{name}" ne peut pas dépasser {size} px.',
        msgImageHeightLarge: 'Hauteur de fichier image "{name}" ne peut pas dépasser {size} px.',
        dropZoneTitle: 'Glissez et déposez les photos ici&hellip;',
        fileActionSettings: {
            removeTitle: 'Supprimer la photo',
            uploadTitle: 'Télécharger une photo',
            indicatorNewTitle: 'Pas encore téléchargé',
            indicatorSuccessTitle: 'Posté',
            indicatorErrorTitle: 'Ajouter erreur',
            indicatorLoadingTitle: 'ajout ...'
        }
    };
})(window.jQuery);