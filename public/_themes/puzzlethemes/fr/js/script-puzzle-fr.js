// Menu PC
function toggleMenu() {
    var menuIcon = document.getElementById('menu-icon');
    menuIcon.classList.toggle('active');
    var menuLinkProduits = document.querySelector('.menu-link-produits');
    menuLinkProduits.style.backgroundColor = menuIcon.classList.contains('active') ? '#292929' : '';
    menuLinkProduits.querySelector('.link-produits').style.color = menuIcon.classList.contains('active') ? 'white' : '';
    var sousMenu = document.querySelector('.content-sous-menu-desktop');
    sousMenu.classList.toggle('active');

    if (!sousMenu.classList.contains('active')) {
        resetMenuState();
    }
}

function resetMenuState() {
    var menuIcon = document.getElementById('menu-icon');
    menuIcon.classList.remove('active');
    var menuLinkProduits = document.querySelector('.menu-link-produits');
    menuLinkProduits.style.backgroundColor = '';
    menuLinkProduits.querySelector('.link-produits').style.color = '';
    var subMenus = document.querySelectorAll('.sous-title-menu3');
    subMenus.forEach(function (subMenu) {
        subMenu.style.display = 'none';
    });
    var sousMenuValue = document.querySelectorAll('.sous-value-menu');
    sousMenuValue.forEach(function (itemSousMenuValue) {
        itemSousMenuValue.classList.remove('hover');
    });
    var subMenuItems = document.querySelectorAll('.submenu');
    subMenuItems.forEach(function (item) {
        item.classList.remove('hover');
    });
    var menuColumns = document.querySelectorAll('.menu-column:not(:first-child)');
    menuColumns.forEach(function (column) {
        column.classList.remove('active');
    });

}

function showSubMenu(event, id) {
    var subMenu = document.getElementById(id);

    subMenu.style.display = 'flex';
    var menuColumn = subMenu.closest('.menu-column');
    if (menuColumn) {
        menuColumn.classList.add('active');
    }
    var mainMenu = document.querySelector('.menu-column.active');
    setTabindex(mainMenu, -1);
    setTabindex(subMenu, 0);
}

function showSubSubMenu(event, id) {
    var subSubMenu = document.getElementById(id);
    if (subSubMenu) {
        subSubMenu.style.display = 'flex';
        var menuColumn = subSubMenu.closest('.menu-column');
        var previousMenu = document.querySelector('#menu-column2');
        setTabindex(previousMenu, -1);
        setTabindex(subSubMenu, 0);
    }
}

function updateSubMenu2(event, id) {
    var subMenu2 = document.querySelectorAll('.menu-column:nth-child(2) .sous-title-menu');
    subMenu2.forEach(function (subMenu) {
        subMenu.style.display = 'none';
    });

    var subMenu = document.getElementById(id);
    subMenu.style.display = 'flex';

    var subSubMenus = document.querySelectorAll('.menu-column:nth-child(3) .sous-title-menu');
    subSubMenus.forEach(function (subSubMenu) {
        subSubMenu.style.display = 'none';
    });
}

function updateSubMenu3(column2Id) {
    var subMenu3Items = document.querySelectorAll('.menu-column:nth-child(3) .sous-title-menu');
    subMenu3Items.forEach(function (item) {
        item.style.display = 'none';
    });

    var column3Element = document.getElementById(column2Id);
    if (column3Element) {
        column3Element.style.display = 'flex';
    }
}

function clearSubSubMenu() {
    var subSubMenus = document.querySelectorAll('.menu-column:nth-child(3) .sous-title-menu');
    subSubMenus.forEach(function (subSubMenu) {
        subSubMenu.style.display = 'none';
        setTabindex(subSubMenu, -1);
    });
    var menuColumns = document.querySelectorAll('.menu-column:not(:first-child)');
    menuColumns.forEach(function (column) {
        column.classList.remove('active');
    });
}

function highlightMenuItem(element) {
    var menuItems = document.querySelectorAll('.submenu');
    menuItems.forEach(function (item) {
        item.classList.remove('hover');
    });
    element.classList.add('hover');
}

function highlightMenuItem2(element) {
    var menuItems = document.querySelectorAll('.sous-value-menu');
    menuItems.forEach(function (item) {
        item.classList.remove('hover');
    });
    element.classList.add('hover');
}

function reapplyActiveClass(element) {
    var menuColumn = element.closest('.menu-column');
    if (menuColumn) {
        menuColumn.classList.add('active');
    }
}


// Menu Mobile

function toggleMenuMobile() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mainMenu = document.getElementById('main-menu');
    const menuMobile = document.querySelector('.menu_mobile');
    const contentMenus = document.querySelectorAll('.content-menu-mobile');
    const body = document.querySelector('body');
    const userMenuContainer = document.querySelector('.user-menu-container-mobile');

    if (userMenuContainer.classList.contains('active')) {
        userMenuContainer.classList.remove('active');
        userMenuContainer.classList.add('hidden');
    }

    burgerMenu.classList.toggle('active');
    menuMobile.classList.toggle('active');
    mainMenu.classList.toggle('active');

    if (burgerMenu.classList.contains('active')) {
        contentMenus.forEach(function (menu) {
            menu.style.display = 'none';
        });
        mainMenu.style.display = 'flex';
        body.classList.add('menu-open');
    } else {
        contentMenus.forEach(function (menu) {
            menu.style.display = 'none';
        });
        mainMenu.style.display = 'none';
        body.classList.remove('menu-open');
    }
}

function toggleUserMenuMobile() {
    const userMenuContainer = document.querySelector('.user-menu-container-mobile');
    const contentMenus = document.querySelectorAll('.content-menu-mobile');
    const menuMobile = document.querySelector('.menu_mobile');
    const burgerMenu = document.querySelector('.burger-menu');
    const mainMenu = document.getElementById('main-menu');

    if (burgerMenu.classList.contains('active')) {
        burgerMenu.classList.remove('active');
        menuMobile.classList.remove('active');
        mainMenu.classList.remove('active');
        contentMenus.forEach(function (menu) {
            menu.style.display = 'none';
        });
    }

    if (userMenuContainer.classList.contains('active')) {
        userMenuContainer.classList.remove('active');
        userMenuContainer.classList.add('hidden');
    } else {
        userMenuContainer.classList.remove('hidden');
        userMenuContainer.classList.add('active');
    }
}

function closeMenuMobile() {
    const contentMenus = document.querySelectorAll('.content-menu-mobile');
    const body = document.querySelector('body');
    const mainMenu = document.getElementById('main-menu');

    contentMenus.forEach(function (menu) {
        menu.style.display = 'none';
    });
    mainMenu.style.display = 'none';
    body.classList.remove('menu-open'); // Ajoutez cette ligne pour réactiver le défilement du corps
}

function showSubMenuMobile(event, index) {
    const submenus = document.querySelectorAll('.content-menu-mobile');
    const menuMobile = document.querySelector('.menu_mobile')
    submenus.forEach(function (menu) {
        menu.style.display = 'none';
    });
    const submenu = document.getElementById(index);
    submenu.style.display = 'flex';
    menuMobile.style.display = 'none';
}

function goToParentMenu(element) {
    var parentMenuId = element.parentElement.parentElement.parentElement.getAttribute('data-parent');
    const menuMobile = document.querySelector('.menu_mobile');
    if (parentMenuId == 'main-menu') {
        menuMobile.style.display = 'flex';
    }
    document.getElementById(parentMenuId).style.display = 'flex';
    element.parentElement.parentElement.parentElement.style.display = 'none';
}


function openTab(event, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("content-puzzles");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";

    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }

    event.currentTarget.classList.add('active');
}

function toggleAgeDropdown(dropdownContainer) {
    var toggle = dropdownContainer.querySelector('.dropdown-toggle');
    var menu = dropdownContainer.querySelector('.dropdown-menu');
    toggle.classList.toggle('opened');
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
}

function toggleAccordeonFaq(element) {
    const isListQues = element.classList.contains('list-ques');
    const clickedText = element.querySelector('.text-small-faq' + (isListQues ? '' : '2'));
    const clickedTitle = element.querySelector('.title-faq');
    const clickedIcon = element.querySelector('img');

    const allQuestions = document.querySelectorAll(isListQues ? '.list-ques' : '.list-ques2');
    allQuestions.forEach(question => {
        const text = question.querySelector('.text-small-faq' + (isListQues ? '' : '2'));
        const title = question.querySelector('.title-faq');
        const icon = question.querySelector('img');
        const focusableElements = question.querySelectorAll('a');

        if (text !== clickedText) {
            text.style.maxHeight = '0';
            question.classList.remove('active');
            title.classList.remove('active');
            icon.src = '/images/add-circle.svg';

            focusableElements.forEach(element => {
                element.setAttribute('tabindex', '-1');
            });
        }
    });

    const focusableElements = element.querySelectorAll('a');

    if (!clickedText.style.maxHeight || clickedText.style.maxHeight === '0px') {
        clickedText.style.maxHeight = clickedText.scrollHeight + 'px';
        element.classList.add('active');
        clickedTitle.classList.add('active');
        clickedIcon.src = '/images/minus-circle.svg';

        focusableElements.forEach(element => {
            element.setAttribute('tabindex', '0');
        });
    } else {
        clickedText.style.maxHeight = '0';
        element.classList.remove('active');
        clickedTitle.classList.remove('active');
        clickedIcon.src = '/images/add-circle.svg';

        focusableElements.forEach(element => {
            element.setAttribute('tabindex', '-1');
        });
    }
}

document.querySelectorAll('.list-ques, .list-ques2').forEach(item => {
    const text = item.querySelector('.text-small-faq, .text-small-faq2');
    if (text) {
        text.style.maxHeight = '0';
    }
});



$(document).ready(function () {
    let originalItems = {};
    let filteredItems = {};

    // Fonction pour initialiser les sliders
    function initSliders() {
        $('.slider-new').each(function (index, element) {
            var $slider = $(element);
            var sliderId = $slider.data('slider-id');
            var $prevBtn = $('.content-btn-slick[data-slider-id="' + sliderId + '"]').find('.new-slick-prev');
            var $nextBtn = $('.content-btn-slick[data-slider-id="' + sliderId + '"]').find('.new-slick-next');

            $prevBtn = $prevBtn.length ? $prevBtn : false;
            $nextBtn = $nextBtn.length ? $nextBtn : false;

            $slider.addClass('slider-' + index);

            var slidesToShow = $slider.data('slides-to-show');
            var slidesToScroll = $slider.data('slides-to-scroll');
            var breakpoints = $slider.data('breakpoints');

            var slickOptions = {
                slidesToShow: slidesToShow,
                slidesToScroll: slidesToScroll,
                prevArrow: $prevBtn,
                nextArrow: $nextBtn,
                variableWidth: true,
                swipe: false,
                dots: false,
                infinite: false
            };

            if (breakpoints) {
                slickOptions.responsive = breakpoints.map(function (breakpoint) {
                    var settings = {
                        slidesToShow: breakpoint.slidesToShow,
                        slidesToScroll: breakpoint.slidesToScroll,
                        swipe: breakpoint.swipe !== undefined ? breakpoint.swipe : true,
                        dots: breakpoint.dots !== undefined ? breakpoint.dots : true
                    };

                    if (settings.dots) {
                        settings.prevArrow = false;
                        settings.nextArrow = false;
                    }

                    return {
                        breakpoint: breakpoint.breakpoint,
                        settings: settings
                    };
                });
            }

            $slider.slick(slickOptions);
            $slider.slick('slickGoTo', 0);
        });
    }

    // Fonction pour restaurer tous les éléments supprimés et appliquer le filtre
    function restoreAndFilter(sliderId, filter, restoreAll = false) {
        var $slider = $(`.slider-new[data-slider-id="${sliderId}"]`);

        // Restaurer les éléments originaux
        $slider.slick('slickRemove', null, null, true);
        originalItems[sliderId].forEach(function (item) {
            $slider.slick('slickAdd', item);
        });

        if (!restoreAll) {
            // Filtrer les éléments
            filteredItems[sliderId] = originalItems[sliderId].filter(function (item) {
                var ageGroup = item.dataset.ageGroup || '';
                var mif = item.dataset.mif || '';

                if (
                    (filter === 'adulte' && ageGroup !== 'adulte') ||
                    (filter === 'enfant' && ageGroup !== 'enfant') ||
                    (filter === 'fabriqué en france' && mif !== 'true')
                ) {
                    return false;
                }
                return true;
            });
        } else {
            filteredItems[sliderId] = originalItems[sliderId];
        }

        // Mettre à jour l'affichage
        updateDisplay(sliderId);
    }

    // Fonction pour mettre à jour l'affichage des éléments filtrés
    function updateDisplay(sliderId) {
        var $slider = $(`.slider-new[data-slider-id="${sliderId}"]`);
        $slider.find('.product-item').hide();
        filteredItems[sliderId].forEach(function (item) {
            $(item).show();
        });
        $slider.slick('setPosition');
    }

    // Initialisation des sliders au chargement de la page
    initSliders();

    // Gestion du clic sur les tags de filtre
    $('.filter-tag').on('click', function () {
        var $filterTag = $(this);
        var filter = $filterTag.data('filter');
        var sliderId = $filterTag.data('slider-id');
        var isActive = $filterTag.hasClass('active');

        // Retirer la classe active de tous les tags
        $(`.filter-tag[data-slider-id="${sliderId}"]`).removeClass('active');

        if (isActive) {
            // Si le tag était déjà actif, restaurer tous les éléments
            restoreAndFilter(sliderId, filter, true);
        } else {
            // Sinon, appliquer le filtre
            $filterTag.addClass('active');
            restoreAndFilter(sliderId, filter);
        }

        // Revenir au début du slider
        $('.slider-new[data-slider-id="' + sliderId + '"]').slick('slickGoTo', 0);
    });

    // Sauvegarder tous les éléments originaux au chargement de la page
    $('.slider-new').each(function () {
        var sliderId = $(this).data('slider-id');
        originalItems[sliderId] = $(this).find('.product-item').toArray();
    });

    $('.new-slick-next').on('click', function() {
        var sliderId = $(this).data('slider-id');
        var $slider = $('.slider-new[data-slider-id="' + sliderId + '"]');
        if (!$slider.hasClass('has-slided')) {
            $slider.addClass('fullscreen has-slided');
        }
    });

    $('.new-slick-prev').on('click', function() {
        var sliderId = $(this).data('slider-id');
        var $slider = $('.slider-new[data-slider-id="' + sliderId + '"]');
        if ($slider.slick('slickCurrentSlide') === 0) {
            $slider.removeClass('fullscreen has-slided');
        }
    });

});


function togglePaysMenu(menuId) {
    var choixPaysMenuMobile = document.getElementById(menuId);
    choixPaysMenuMobile.style.display = (choixPaysMenuMobile.style.display === 'flex') ? 'none' : 'flex';
}



function toggleMenuInfos(element, blockInfoId, arrowId) {
    const infosBlock = document.getElementById(blockInfoId);
    const arrowIcon = document.getElementById(arrowId);
    const computedStyle = window.getComputedStyle(infosBlock);
    const isDisplayed = computedStyle.getPropertyValue('display') !== 'none';
    if (blockInfoId.startsWith('infos-paiement')) {
        if (!isDisplayed) {
            infosBlock.style.display = "flex";
            arrowIcon.classList.add("rotate-arrow");
            element.classList.add('active')
        } else {
            infosBlock.style.display = "none";
            arrowIcon.classList.remove("rotate-arrow");
            element.classList.remove('active')
        }
    } else if (blockInfoId.startsWith('infos-livraison')) {
        if (!isDisplayed) {
            infosBlock.style.display = "block";
            arrowIcon.classList.add("rotate-arrow");
            element.classList.add('active')
        } else {
            infosBlock.style.display = "none";
            arrowIcon.classList.remove("rotate-arrow");
            element.classList.remove('active')
        }
    }
}

function toggleMenuInfosOnChange() {
    const radios = document.querySelectorAll('input[name="mode_paiement"]');
    radios.forEach(radio => {
        const blocMenu = radio.closest('.bloc-menu-infoca');
        const blockInfoId = blocMenu.querySelector('.infos-block-menu').id;

        if (radio.checked) {
            blocMenu.classList.add('bloc-active');
            document.getElementById(blockInfoId).style.display = "flex";
        } else {
            blocMenu.classList.remove('bloc-active');
            document.getElementById(blockInfoId).style.display = "none";
        }
    });
}

function toggleInfosOnChange(element, arrowId, blockInfoId) {
    const allBlocks = document.querySelectorAll('.bloc-menu-qui');
    const infosBlock = document.getElementById(blockInfoId);
    const arrowIcon = document.getElementById(arrowId);

    // Close all blocks
    allBlocks.forEach(block => {
        const isActive = block.classList.contains('block_active');
        const relatedBlockId = block.querySelector('.arrow-icon').id.replace('fl-', 'descritif');
        const relatedBlock = document.getElementById(relatedBlockId);
        const relatedArrow = block.querySelector('.arrow-icon');
        if (isActive && block !== element) {
            block.classList.remove('block_active');
            relatedBlock.style.maxHeight = '0';
            relatedArrow.style.transform = 'rotate(0deg)';
        }
    });

    // Toggle the clicked block
    const isActive = element.classList.contains('block_active');
    if (isActive) {
        element.classList.remove('block_active');
        infosBlock.style.maxHeight = '0';
        arrowIcon.style.transform = 'rotate(0deg)';
    } else {
        element.classList.add('block_active');
        infosBlock.style.maxHeight = '2000px';
        arrowIcon.style.transform = 'rotate(180deg)';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const firstBlock = document.querySelector('.bloc-menu-qui');
    if (firstBlock) {
        firstBlock.classList.add('block_active');
        const firstInfoBlock = firstBlock.querySelector('.infos-block-qui');
        firstInfoBlock.style.maxHeight = '2000px';
        const firstArrow = firstBlock.querySelector('.arrow-icon');
        firstArrow.style.transform = 'rotate(180deg)';
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const defaultRadio = document.getElementById('mode_paiement_9');
    if (defaultRadio) {
        defaultRadio.checked = true;
        toggleMenuInfosOnChange();

        const radios = document.querySelectorAll('input[name="mode_paiement"]');
        radios.forEach(radio => {
            radio.addEventListener('change', toggleMenuInfosOnChange);
        });
    }
});

document.querySelectorAll('.bloc-menu-infoca').forEach(bloc => {
    bloc.addEventListener('click', function () {
        const radio = this.querySelector('input[name="mode_paiement"]');
        if (radio) {
            radio.checked = true;
            toggleMenuInfosOnChange();
        }
    });
});




function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function handleSearch(target) {
    var previousSearchText = "";
    var searchText = $('.search-text-' + target).val().toLowerCase();
    var searchWithoutAccents = removeAccents(searchText);
    var hasMatchingLink = false;
    if (searchWithoutAccents !== previousSearchText[target]) {
        $('.menu_auteur').each(function () {
            hasMatchingLink = false;
            if ($(this).closest('#' + target).length > 0) {
                $(this).find('a').each(function () {
                    var linkText = $(this).text().toLowerCase();
                    var linkWithoutAccents = removeAccents(linkText);
                    if (searchWithoutAccents === "" || linkWithoutAccents.includes(searchWithoutAccents)) {
                        $(this).show();
                        hasMatchingLink = true;
                    } else {
                        $(this).hide();
                    }
                });
                if (!hasMatchingLink) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            }
        });
        if (searchWithoutAccents.length === 0) {
            $('#' + target + ' .side-bar').show();
            $('#no-result-search').hide();
        } else {
            $('#' + target + ' .side-bar').hide();
            if (!hasMatchingLink) {
                $('#no-result-search').show();
            } else {
                $('#no-result-search').hide();
            }
        }
        previousSearchText[target] = searchWithoutAccents;
    }
}

const currentUrl = window.location.href;

document.addEventListener('click', function (event) {
    var dropdownContainers = document.querySelectorAll('#select-pays-menu-mobile');
    var choixPaysMenuMobiles = document.querySelectorAll('.choix-pays-menu-mobile');
    if (choixPaysMenuMobiles) {
        dropdownContainers.forEach(function (container, index) {
            if (!container.contains(event.target) && !choixPaysMenuMobiles[index].contains(event.target)) {
                choixPaysMenuMobiles[index].style.display = 'none';
            }
        });
    }
});

if (currentUrl.includes("/infos/?pg=espace-informations")) {
    document.addEventListener("DOMContentLoaded", function () {
        toggleMenuInfos('infos-paiement1', 'arrow1');

        const infoBlocks = document.querySelectorAll(".bloc-menu-info");
        const modesLivraisonBlock = document.getElementById("modes-livraison");
        const menuItems = document.querySelectorAll(".paginfo-menu");
        modesLivraisonBlock.style.display = "flex";

        // Function to update the image src
        function updateImageSrc(menuItem, isActive) {
            const imgElement = menuItem.querySelector('img');
            if (isActive) {
                imgElement.src = menuItem.getAttribute('data-image-active');
            } else {
                imgElement.src = menuItem.getAttribute('data-image-inactive');
            }
        }

        // Set initial active state
        menuItems.forEach(menuItem => {
            const isActive = menuItem.getAttribute("data-target") === "modes-livraison";
            menuItem.classList.toggle("paginfo-menuactiv", isActive);
            updateImageSrc(menuItem, isActive);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const blockId = urlParams.get('block');

        if (blockId) {
            const blockElement = document.getElementById(blockId);
            const correspondingMenuItem = document.querySelector(`[data-target="${blockId}"]`);
            if (blockElement && correspondingMenuItem) {
                infoBlocks.forEach(block => {
                    block.style.display = "none";
                });
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove("paginfo-menuactiv");
                    updateImageSrc(menuItem, false);
                });
                blockElement.style.display = "flex";
                correspondingMenuItem.classList.add("paginfo-menuactiv");
                updateImageSrc(correspondingMenuItem, true);
            }
        }

        menuItems.forEach(item => {
            item.addEventListener("click", function (event) {
                event.preventDefault();
                infoBlocks.forEach(block => {
                    block.style.display = "none";
                });
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove("paginfo-menuactiv");
                    updateImageSrc(menuItem, false);
                });
                this.classList.add("paginfo-menuactiv");
                updateImageSrc(this, true);
                const targetBlockId = this.getAttribute("data-target");
                const targetBlock = document.getElementById(targetBlockId);
                if (targetBlock) {
                    targetBlock.style.display = "flex";
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('block', targetBlockId);
                    window.history.pushState({}, '', newUrl);
                }
            });
        });

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        document.querySelectorAll('.select-bloc-information').forEach(function (select) {
            select.classList.add('select-hidden');
            var wrapper = document.createElement('div');
            wrapper.classList.add('select');
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);

            var contentSelect = document.createElement('div');
            contentSelect.classList.add('content-select');
            wrapper.appendChild(contentSelect);

            var styledSelect = document.createElement('div');
            styledSelect.classList.add('select-styled');
            contentSelect.appendChild(styledSelect);

            var list = document.createElement('ul');
            list.classList.add('select-options');
            wrapper.appendChild(list);

            Array.from(select.children).forEach(function (option) {
                var optionText = option.textContent;
                var optionValue = option.value;
                var imagePath = "/_themes/puzzlethemes/fr/images/" + optionValue + ".svg";

                var listItem = document.createElement('li');
                listItem.setAttribute('class', option.getAttribute('class'));
                listItem.setAttribute('data-value', optionValue);
                listItem.innerHTML = '<img src="' + imagePath + '" alt="' + optionText + '" width="24" height="24">' + optionText;
                list.appendChild(listItem);

                if (option.selected) {
                    listItem.classList.add('is-selected');
                    styledSelect.innerHTML = '<img src="' + imagePath + '" alt="' + optionText + '" width="24" height="24">' + optionText;
                }
                var divider = document.createElement('div');
                divider.classList.add('divider');
                list.appendChild(divider);
            });

            var listItems = list.querySelectorAll('li');
            contentSelect.addEventListener('click', function (e) {
                e.stopPropagation();
                document.querySelectorAll('div.select-styled.active').forEach(function (item) {
                    if (item !== contentSelect) {
                        item.classList.remove('active');
                        item.nextElementSibling.style.display = 'none';
                        item.innerHTML = item.dataset.selectedText;
                    }
                });

                this.classList.toggle('active');
                this.nextElementSibling.style.display = this.classList.contains('active') ? 'flex' : 'none';

                if (this.classList.contains('active')) {
                    this.dataset.selectedText = styledSelect.innerHTML;
                    styledSelect.innerHTML = '<span style="font-size: 14px;font-weight: 600;">Menu</span>';
                } else {
                    styledSelect.innerHTML = this.dataset.selectedText;
                }
            });

            Array.from(listItems).forEach(function (item) {
                item.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var optionText = this.textContent;
                    var optionValue = this.getAttribute('data-value');
                    var imagePath = "/_themes/puzzlethemes/fr/images/" + optionValue + ".svg";
                    styledSelect.innerHTML = '<img src="' + imagePath + '" alt="' + optionText + '" width="24" height="24">' + optionText;
                    contentSelect.classList.remove('active');
                    list.style.display = 'none';
                    select.value = optionValue;
                    Array.from(list.children).forEach(function (li) {
                        li.classList.remove('is-selected');
                    });

                    Array.from(listItems).forEach(function (li) {
                        var optionClass = li.getAttribute('class');
                        document.getElementById(optionClass).style.display = 'none';
                    });
                    document.getElementById(this.getAttribute('class')).style.display = 'flex';
                    var currentUrl = window.location.href;
                    var urlWithoutParams = currentUrl.split('&')[0];
                    var newUrl = urlWithoutParams + '&block=' + this.getAttribute('class');
                    history.pushState(null, '', newUrl);
                    this.classList.add('is-selected');
                });
            });

            document.addEventListener('click', function () {
                contentSelect.classList.remove('active');
                list.style.display = 'none';
                styledSelect.innerHTML = contentSelect.dataset.selectedText || styledSelect.innerHTML;
            });

            var blockParam = getUrlParameter('block');
            if (blockParam) {
                Array.from(select.children).forEach(function (option) {
                    if (option.classList.contains(blockParam)) {
                        option.selected = true;
                        var imagePath = "/_themes/puzzlethemes/fr/images/" + option.value + ".svg";
                        document.getElementById(blockParam).style.display = 'flex';
                        styledSelect.innerHTML = '<img src="' + imagePath + '" alt="' + option.innerHTML + '" width="24" height="24">' + option.innerHTML;
                    }
                });
            }
        });
    });
}




document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("ig152") && document.getElementById("ig555")) {
        document.getElementById("ig555").insertAdjacentElement('afterend', document.getElementById("ig152"));
    }
    var contentProduit = document.querySelector(".content-produit");
    var filAriane = document.getElementById("fil_ariane");

    if (contentProduit && filAriane) {
        if (window.innerWidth < 991) {
            var bannerSection = document.querySelector(".banner-section");
            var contentBannerImage = document.querySelector('.content-bandeau-image')
            if (bannerSection) {
                if (contentBannerImage) {
                    contentBannerImage.insertBefore(filAriane, contentBannerImage.firstChild);
                } else {
                    bannerSection.insertBefore(filAriane, bannerSection.firstChild);
                }
            }
        } else {
            contentProduit.parentNode.insertBefore(filAriane, contentProduit);
        }
        filAriane.classList.add("fil-ariane-content-produit");
    }

    const radioGroups = ['radio_pp_format'];
    radioGroups.forEach(groupName => {
        const radios = document.querySelectorAll(`input[name="${groupName}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', () => updateBordersAndSendAjax(groupName));
        });
    });
    var presentation = document.querySelector('.presentation');
    var contentProduit = document.querySelector('.content-produit');

    if (presentation) {
        contentProduit.parentNode.insertBefore(presentation, contentProduit);
    }

    if (window.innerWidth > 992) {
        var bandeauImage = document.querySelector('.bandeau-image');
        if (bandeauImage) {
            if (filAriane) {
                contentProduit.parentNode.insertBefore(presentation, filAriane);
            } else {
                contentProduit.parentNode.insertBefore(presentation, contentProduit);
            }
        }
    }
});

if (currentUrl.includes("/auteurs-personnages.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    let blockToDisplay = urlParams.get('block');

    function toggleBlock(targetId) {
        blockToDisplay = targetId;
        var container = document.querySelector('.button-container');
        var buttons = document.querySelectorAll('.toggle-button');
        var blocks = document.querySelectorAll('.adult-authors, .licenses-children');

        blocks.forEach(function (block) {
            if (block.id === targetId) {
                block.classList.add('active');
                setTabindex(block, 0);
                trapTabKey(block);
            } else {
                block.classList.remove('active');
                setTabindex(block, -1);
            }
        });

        buttons.forEach(function (button) {
            if (button.getAttribute('data-target') === targetId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        if (targetId === 'licenses-children') {
            container.classList.add('active-children');
        } else {
            container.classList.remove('active-children');
        }

        var url = new URL(window.location.href);
        url.searchParams.set('block', targetId);
        window.history.replaceState({}, '', url);

        updateSidebarPosition();
    }


    function updateSidebarPosition() {
        const activeBlock = document.getElementById(blockToDisplay);
        const sideBar = activeBlock.querySelector(".side-bar-authors");
        const buttonContainer = document.querySelector(".button-container");
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const sideBarHeight = sideBar.offsetHeight;
        const buttonContainerTop = buttonContainer.getBoundingClientRect().top + scrollTop;
        const activeBlockBottom = activeBlock.offsetHeight + activeBlock.getBoundingClientRect().top + scrollTop;


        if (scrollTop >= buttonContainerTop) {
            sideBar.style.position = "fixed";
            sideBar.style.top = "126px";
        } else {
            sideBar.style.position = "fixed";
            sideBar.style.top = "284px";
        }

        if (scrollTop + sideBarHeight >= activeBlockBottom - 126) {
            sideBar.style.position = "absolute";
            sideBar.style.top = activeBlock.offsetHeight - sideBarHeight + "px";
        }
    }

    window.addEventListener('DOMContentLoaded', (event) => {
        if (!blockToDisplay) {
            blockToDisplay = 'adult-authors';
        }

        document.querySelectorAll('.adult-authors, .licenses-children').forEach(bloc => {
            bloc.classList.remove('active');
            setTabindex(bloc, -1);
        });

        const activeBlock = document.getElementById(blockToDisplay);
        activeBlock.classList.add('active');
        setTabindex(activeBlock, 0);
        trapTabKey(activeBlock);

        document.querySelectorAll('.toggle-button').forEach(bouton => {
            bouton.classList.remove('active');
        });

        const activeButton = document.querySelector('.toggle-button[data-target="' + blockToDisplay + '"]');
        if (activeButton) {
            activeButton.classList.add('active');
        }

        const conteneur = document.querySelector('.button-container');
        if (blockToDisplay === 'licenses-children') {
            conteneur.classList.add('active-children');
        } else {
            conteneur.classList.remove('active-children');
        }

        updateSidebarPosition();
    });

    $(document).ready(function () {
        $('.search-text-adult-authors').bind('keypress keydown keyup', function () {
            handleSearch('adult-authors');
        });
        $('.search-text-licenses-children').bind('keypress keydown keyup', function () {
            handleSearch('licenses-children');
        });
    });

    document.addEventListener("scroll", function () {
        updateSidebarPosition();
    });
}


function toggleProduit(arrowId, contentId, containerId, rowId) {
    const arrowIcon = document.getElementById(arrowId);
    const produitContent = document.getElementById(contentId);
    const container = document.getElementById(containerId);
    const blocPti = document.querySelector(rowId);
    const targetElement = event.target;
    if ($(targetElement).closest('.btAddressCaddie').length) {
        return;
    }

    if (container || (blocPti && ![...blocPti.classList].some(cls => cls.includes('recap-panier')))) {
        closeAllOthers(contentId);
    }

    if (produitContent) {
        if (produitContent.style.maxHeight && produitContent.style.maxHeight !== "0px") {
            produitContent.style.maxHeight = "0px";
            if (container) {
                container.classList.remove('box-trans');
                container.classList.add('box-transoff');
            }
            if (blocPti) {
                if ([...blocPti.classList].some(cls => cls.includes('recap-panier'))) {
                    blocPti.classList.remove('bloc-open-recap');
                    blocPti.classList.add('ban-ferm-recap');
                    arrowIcon.style.transform = 'rotate(0deg)';
                } else {
                    blocPti.classList.remove('bloc-p-ti');
                    blocPti.classList.add('ban-ferm-pan');
                    arrowIcon.src = '/images/nav-arrow-down-n-pan.svg';
                }
            } else {
                arrowIcon.style.transform = 'rotate(180deg)';
            }
        } else {
            produitContent.style.maxHeight =  "2000px";
            if (container) {
                container.classList.remove('box-transoff');
                container.classList.add('box-trans');
            }
            if (blocPti) {
                if ([...blocPti.classList].some(cls => cls.includes('recap-panier'))) {
                    blocPti.classList.remove('ban-ferm-recap');
                    blocPti.classList.add('bloc-open-recap');
                    arrowIcon.style.transform = 'rotate(180deg)';
                } else {
                    blocPti.classList.remove('ban-ferm-pan');
                    blocPti.classList.add('bloc-p-ti');
                    arrowIcon.src = '/images/nav-arrow-down-pan.svg';
                }
            } else {
                arrowIcon.style.transform = 'rotate(0deg)';
            }
        }
    }
}

function closeAllOthers(currentContentId) {
    const allContents = document.querySelectorAll('.block-livraison');
    const allArrows = document.querySelectorAll('.pict-pan');
    const allContainers = document.querySelectorAll('.toggle-container');

    allContents.forEach(content => {
        if (content.id !== currentContentId) {
            content.style.maxHeight = "0px";
        }
    });

    allArrows.forEach(arrow => {
        arrow.style.transform = 'rotate(0deg)';
    });

    allContainers.forEach(container => {
        if (container.classList.contains('box-trans')) {
            container.classList.remove('box-trans');
            container.classList.add('box-transoff');
        }
    });
}
if (document.getElementById('choiceAddress')) {
    document.getElementById('choiceAddress').addEventListener('click', function(event) {
        event.stopPropagation();
    });
}


document.addEventListener('DOMContentLoaded', function () {
    toggleProduit('arrow-box-trans', 'blockpr', 'contentblockpr');
    toggleProduit('arrow-adresse-livr', 'adresse-livr', null, '.row-adresse-livr');
});

function togglePopUp(popUpMembreProduitId) {
    const popUpMembreProduit = document.querySelector(popUpMembreProduitId);
    if (popUpMembreProduit.style.display === 'flex') {
        popUpMembreProduit.style.display = 'none';
    } else {
        popUpMembreProduit.style.display = 'flex';
    }
}

function fermerPopUp(popUpMembreProduitId) {
    const popUpMembreProduit = document.querySelector(popUpMembreProduitId);
    popUpMembreProduit.style.display = 'none';
}

if (document.getElementById('increment')) {
    document.getElementById('increment').addEventListener('click', function() {
        const input = document.getElementById('selectFPstock');
        input.value = parseInt(input.value) + 1;
    });
}

if(document.getElementById('decrement')) {
    document.getElementById('decrement').addEventListener('click', function() {
        const input = document.getElementById('selectFPstock');
        if (input.value > 1) {
            input.value = parseInt(input.value) - 1;
        }
    });
}

$(document).ready(function () {
    const $button = $('.button-select-nb-product');
    const $menu = $('.select-nb-product-menu');
    const $selectText = $('.select-nb-product-text');
    const $input = $('#selectFPstock');

    $button.on('click', function () {
        const expanded = $button.attr('aria-expanded') === 'true';
        $button.attr('aria-expanded', !expanded);
        $menu.toggle();
    });

    $menu.on('click', '.select-nb-product-item', function () {
        const selectedValue = $(this).data('value');
        $selectText.text(selectedValue);
        if ($input) {
            $input.val(selectedValue);
        }
        $menu.hide();
        $button.attr('aria-expanded', false);
    });

    $(document).on('click', function (event) {
        if (!$button.is(event.target) && !$menu.is(event.target) && $menu.has(event.target).length === 0) {
            $menu.hide();
            $button.attr('aria-expanded', false);
        }
    });
});

function updateBordersAndSendAjax(groupName) {
    const radios = document.querySelectorAll(`input[name="${groupName}"]`);
    radios.forEach(r => {
        const tbody = r.closest('tbody');
        if (tbody) {
            tbody.style.border = '1px solid #DCDCDC';
        }
        const tr = r.closest('tr');
        if (tr) {
            tr.classList.remove('selected-row');
        }
    });
    const checkedRadio = document.querySelector(`input[name="${groupName}"]:checked`);
    if (checkedRadio) {
        const selectedTbody = checkedRadio.closest('tbody');
        if (selectedTbody) {
            selectedTbody.style.border = '1px solid #FF780F';
        }
        const selectedTr = checkedRadio.closest('tr');
        if (selectedTr) {
            selectedTr.classList.add('selected-row');
        }

        // Get the selected nbpiece value
        const selectedNbpiece = checkedRadio.getAttribute('data-nbpiece');
        // Send AJAX request
        sendAjaxRequest(selectedNbpiece);
    }
}

const checkedRadio = document.querySelector(`input[name='radio_pp_format']:checked`);
if (checkedRadio) {
    const selectedTbody = checkedRadio.closest('tbody');
    if (selectedTbody) {
        selectedTbody.style.border = '1px solid #FF780F';
    }
}

function sendAjaxRequest(nbpiece) {
    fetch('/catalogue/puzzles-personnalises.php?pg=nbpiece', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nbpiece: nbpiece
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse la réponse JSON
        })
        .then(data => {
            // Vérifiez si la réponse contient les données attendues
            if (data.status === 'success' && data.produit_complementaire) {
                // Mettez à jour les produits existants avec les nouveaux produits
                updateExistingProducts(data.produit_complementaire);
            } else {
                console.error('Error:', data.error); // Gérez les erreurs si nécessaire
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateExistingProducts(produitComplementaire) {
    if (produitComplementaire.produit_tapis) {
        updateProduct('.together-products:nth-child(1)', produitComplementaire.produit_tapis, produitComplementaire);
        updateProduct('.cube-prod-acc-tapis', produitComplementaire.produit_tapis, produitComplementaire, true);
    }

    if (produitComplementaire.afficheCollerVotrePuzzle) {
        const colleProductData = {
            image700: produitComplementaire.imageProduitColle,
            libelle: produitComplementaire.libelleProduitColle,
            prixclient: produitComplementaire.prixClientProduitColle,
            ID: produitComplementaire.produitColle,
            phpfile: produitComplementaire.phpfileProduitColle
        };
        updateProduct('.together-products-price', colleProductData, produitComplementaire);
        updateProduct('.cube-prod-acc-colle', colleProductData, produitComplementaire, true);
    }

    let totalPrix = 0;
    if (produitComplementaire.produit_tapis) {
        totalPrix += parseFloat(produitComplementaire.produit_tapis.prixclient);
    }
    if (produitComplementaire.afficheCollerVotrePuzzle) {
        totalPrix += parseFloat(produitComplementaire.prixClientProduitColle);
    }
    if (produitComplementaire.afficheBdtVotrePuzzle) {
        totalPrix += parseFloat(produitComplementaire.prixClientProduitBdt);
    }

    updateTotalPrice(totalPrix);
}

function updateTotalPrice(newTotalPrice) {
    const totalPriceElement = document.querySelector('.content-total-together-products span');
    const totalPriceElementMobile = document.querySelector('.span-total-together-products');
    if (totalPriceElement) {
        totalPriceElement.textContent = 'Total : ' + newTotalPrice.toFixed(2) + '€';
    }
    if (totalPriceElementMobile) {
        totalPriceElementMobile.textContent = 'Total : ' + newTotalPrice.toFixed(2) + '€';
    }
}

function updateProduct(selector, productData, produitComplementaire, isMobile = false) {
    const productElement = document.querySelector(selector);
    if (productElement) {
        const mobileBlock = document.querySelector('.bloc-other-products-mobile');
        const displayStyle = window.getComputedStyle(mobileBlock).display;
        if (displayStyle != 'none') {
            const imgElement = productElement.querySelector('.link-product img');
            if (imgElement) {
                imgElement.src = productData.image700;
            }

            const libelleElement = productElement.querySelector('.libelle2-acc-libelle');
            if (libelleElement) {
                libelleElement.textContent = productData.libelle;
            }

            const phpfileElementLinkProducts = productElement.querySelector('.link-product');
            if (phpfileElementLinkProducts) {
                phpfileElementLinkProducts.setAttribute('href', `/${productData.phpfile}`);
            }

            const phpfileElement = productElement.querySelector('.libelle2-acc a');
            if (phpfileElement) {
                phpfileElement.setAttribute('href', `/${productData.phpfile}`);
            }

            const prixElement = productElement.querySelector('.prix-client-barre');
            if (prixElement) {
                prixElement.textContent = productData.prixclient + ' €';
            }

            const addToCartButton = productElement.querySelector('.button-add-cart');
            if (addToCartButton) {
                addToCartButton.setAttribute('onClick', `addproduitz(${productData.ID}, 1, -1, 1);`);
            }
            const addToCartButtonElementMobile = document.querySelector('.btn-add-all-to-cart-mobile');
            if (addToCartButtonElementMobile) {
                addToCartButtonElementMobile.setAttribute('onClick', `addAllToCartTOTO(${JSON.stringify(produitComplementaire)});`);
            }
        } else {
            const contentProductsImage = productElement.querySelector('.content-together-products');
            const contentProducts = productElement.querySelector('.content-products');
            const productsPrice = productElement.querySelector('.products-price');
            const addToCartButton = productElement.querySelector('button');
            if (contentProductsImage) {
                const imgElement = contentProductsImage.querySelector('img');
                if (imgElement) {
                    imgElement.src = productData.image700;
                }

                const libelleElement = contentProducts.querySelector('.products-libelle');
                if (libelleElement) {
                    libelleElement.textContent = productData.libelle;
                }
            }

            if (productsPrice) {
                productsPrice.textContent = productData.prixclient + '€';
            }

            if (addToCartButton) {
                addToCartButton.setAttribute('onClick', `addproduitz(${productData.ID}, 1, -1, 1);`);
            }
            const addToCartButtonElement = document.querySelector('.content-total-together-products button');
            if (addToCartButtonElement) {
                addToCartButtonElement.setAttribute('onClick', `addAllToCartTOTO(${JSON.stringify(produitComplementaire)});`);
            }
        }
    }


}

function addAllToCartTOTO(produitComplementaire) {
    if (produitComplementaire.produit_tapis) {
        addproduitz(produitComplementaire.produit_tapis.ID, 1, -1, 1);
    }

    if (produitComplementaire.afficheCollerVotrePuzzle) {
        addproduitz(produitComplementaire.produitColle, 1, -1, 1);
    }

    if (produitComplementaire.afficheBdtVotrePuzzle) {
        addproduitz(produitComplementaire.idProduitBoiteDeTri, 1, -1, 1);
    }
}



function selectPuzzle(element) {
    var puzzleOptions = document.querySelectorAll('.puzzle-option');

    puzzleOptions.forEach(function(option) {
        option.classList.remove('selected');
    });
    element.classList.add('selected');

    const radioInput = element.querySelector('input[type="radio"]');
    radioInput.checked = true;

    const selectedText = element.querySelector('.nom').textContent;
    document.getElementById('selected_puzzle').textContent = selectedText;

    const label = element.getAttribute('data-label');
    const dimensions = element.getAttribute('data-dimensions');
    const prix = element.getAttribute('data-prix');
    document.getElementById('taille_select').innerHTML = label + ' <span style="font-weight: 400">(' + dimensions + ')</span> - ' + prix;

    var puzzleList = document.getElementById('puzzle_list');
    if (puzzleList) {
        puzzleList.style.display = 'none';
    }
}
function selectPuzzleEtape3(element) {
    var x1 = $('#frm_etape input[name=x1]').val();
    var x2 = $('#frm_etape input[name=x2]').val();
    var y1 = $('#frm_etape input[name=y1]').val();
    var y2 = $('#frm_etape input[name=y2]').val();
    var pzp_type = $('input[name=pzp_type]:checked').val();
    var format = ($('#paysage').hasClass('selected')) ? 'paysage' : 'portrait';
    var idProduit = element.getAttribute('data-id-produit');
    var url = '/catalogue/puzzle-personnalise.php?etape=2&id='+$('#frm_etape input[name=id]').val() + '&ref=' + idProduit + '&x1=' + x1 + '&x2=' + x2 + '&y1=' + y1 + '&y2=' + y2 + '&pzp_type=' + pzp_type + '&format=' + format;
    window.location.href = url;
}

function togglePuzzleList() {
    var puzzleList = document.getElementById('puzzle_list');
    puzzleList.style.display = puzzleList.style.display === 'block' ? 'none' : 'block';

    if (puzzleList.style.display === 'block') {
        currentIndex = -1;
    }
}


document.addEventListener('click', function (event) {
    var puzzleSelectContainer = document.getElementById('puzzle_select_container');
    var puzzleList = document.getElementById('puzzle_list');

    if (puzzleList) {
        var isClickInside = puzzleSelectContainer.contains(event.target);
        if (!isClickInside) {
            puzzleList.style.display = 'none';
        }
    }

});

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('puzzle_list')) {
        var idProduit = document.getElementById('puzzle_list').getAttribute('data-id');
        if (idProduit) {
            var puzzleInput = document.getElementById('puzzle_' + idProduit);
            if (puzzleInput) {
                puzzleInput.checked = true;
                var parentDiv = puzzleInput.closest('.puzzle-option');
                if (parentDiv) {
                    selectPuzzle(parentDiv);
                }
            }
        }
    }
});



document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('#bloc_pc .onglet_boite:first-child').forEach(function (onglet) {
        const img = onglet.querySelector('img');
        img.src = '/images/square-on.svg';
    });
});

document.querySelectorAll('#bloc_pc .onglet_boite').forEach(function (onglet) {
    onglet.addEventListener('click', function () {
        selectOnglet(this);
    });
    onglet.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            selectOnglet(this);
        }
    });
});

function selectOnglet(onglet) {
    document.querySelectorAll('#bloc_pc .onglet_boite').forEach(function (onglet) {
        const img = onglet.querySelector('img');
        img.src = '/images/square-off.svg';
    });

    const img = onglet.querySelector('img');
    img.src = '/images/square-on.svg';
}

let currentIndex = 0;

function moveCarousel() {
    const carousel = document.querySelector('.carousel-boite-pp');
    const imageWidth = document.querySelector('.carousel-boite-pp img').clientWidth;
    carousel.style.transform = `translateX(${(-currentIndex * imageWidth) - (8 * currentIndex)}px)`;
}

function moveLeft() {
    if (currentIndex > 0) {
        currentIndex--;
        moveCarousel();
    }
}

function moveRight() {
    const carousel = document.querySelector('.carousel-boite-pp');
    const totalImages = document.querySelectorAll('.carousel-boite-pp img').length;
    const imagesVisible = 3;

    if (currentIndex < totalImages - imagesVisible) {
        currentIndex++;
        moveCarousel();
    }
}
if (document.querySelector('.carousel-boite-pp')) {
    window.addEventListener('resize', moveCarousel);
}

$('div.liste_' + $('#pzp_type_list').val()).show();
$('#pzp_liste_loader').hide();
if ($('#frm_etape input[name="ref"]').val() != '') {
    $('input[name="pzp_type"]').each(function () {
        var v = $(this).val().split(';')[0];
        if (v == $('#frm_etape input[name="ref"]').val()) {
            $(this).parent('div').click();
        }
    });
} else {
    $('input.premier_1').parent('div').click();
}


function selectRadio(row) {
    const radios = document.querySelectorAll("input[name='radio_pp_format']");
    radios.forEach(r => {
        const tbody = r.closest('tbody');
        if (tbody) {
            tbody.style.border = '1px solid #DCDCDC';
        }
        const tr = r.closest('tr');
        if (tr) {
            tr.classList.remove('selected-row');
        }
    });

    var radio = row.querySelector('input[type="radio"]');
    if (radio) {
        radio.checked = true;
        const selectedTbody = radio.closest('tbody');
        if (selectedTbody) {
            selectedTbody.style.border = '1px solid #FF780F';
        }
        const selectedTr = radio.closest('tr');
        if (selectedTr) {
            selectedTr.classList.add('selected-row');
        }
        updateBordersAndSendAjax('radio_pp_format');
    }
}

function toggleCheckboxesAllListe() {
    var checkboxes = document.querySelectorAll('.maliste_produit_check');
    var allChecked = Array.from(checkboxes).every(function (checkbox) {
        return checkbox.checked;
    });

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = !allChecked;
    });
}

function deleteSelectionOrList() {
    var checkboxes = document.querySelectorAll('.maliste_produit_check');
    var selectedCheckboxes = Array.from(checkboxes).filter(function (checkbox) {
        return checkbox.checked;
    });
    if (selectedCheckboxes.length === checkboxes.length) {
        showConfirmationModalWishList();
    } else {
        selectedCheckboxes.forEach(function (checkbox) {
            var productId = checkbox.getAttribute('data-id');
            $.post('/websvc/maliste.ws.php', {
                del: 1,
                id: productId
            }, function (data) {
                document.location.href = document.location.href;
            }, 'json');
        });
    }
}

function showConfirmationModalWishList() {
    document.getElementById('confirmation-modal-wishlist').style.display = 'flex';
    document.getElementById('popup-background-wishlist').style.display = 'block';
    document.getElementById('confirm-delete-wishlist').onclick = function() {
        vide_maliste();
        closeConfirmationModalWishList();
    };
    document.getElementById('cancel-delete-wishlist').onclick = function() {
        closeConfirmationModalWishList();
    };
}

function closeConfirmationModalWishList() {
    document.getElementById('confirmation-modal-wishlist').style.display = 'none';
    document.getElementById('popup-background-wishlist').style.display = 'none';
}



function deleteOneProduct(event) {
    event.preventDefault();
    var clickedElement = event.currentTarget;
    var productId = clickedElement.getAttribute('data-id-product');
    $.post('/websvc/maliste.ws.php', {
        del: 1,
        id: productId
    }, function (data) {
        document.location.href = document.location.href;
    }, 'json');
}

$(document).ready(function () {
    $('#list-source').change(function () {
        var selectedOption = $(this).find('option:selected');
        var id = selectedOption.val();
        $('<div id="fancybox-loading" style="width:400px"><span>' + local_wait + '</span></div>').appendTo('body');
        $.get('/websvc/maliste.ws.php', {
            change: id
        }, function () {
            document.location.href = '/clients/?pg=maliste';
        });
    });


    $('#list-dest').change(function () {
        const sourceListId = document.getElementById('list-source').value;
        const destListId = document.getElementById('list-dest').value;
        if (sourceListId === destListId) {
            alert("La liste source et la liste destination doivent être différentes.");
            return;
        }
        let selectedProducts = [];
        $('.maliste_produit_check:checked').each(function() {
            selectedProducts.push($(this).data('id'));
        });
        if (selectedProducts.length === 0) {
            alert("Aucun produit sélectionné.");
            return;
        }

        $('<div id="fancybox-loading" style="width:400px"><span>' + local_wait + '</span></div>').appendTo('body');
        $.get('/websvc/maliste.ws.php', {
            move: 1,
            idl_source: sourceListId,
            idl_dest: destListId,
            selected_products: selectedProducts.join(',')
        }, function (response) {
            $('#fancybox-loading').remove();
            document.location.href = '/clients/?pg=maliste';
        });
    });

});


const allCubeListe = document.querySelector('.all_cube_maliste');
const itemsCubeList = document.querySelectorAll('.cube_maliste');

if (allCubeListe) {
    itemsCubeList.forEach((item, index) => {
        if ((index + 1) % 3 === 0 && index !== itemsCubeList.length - 1) {
            const separator = document.createElement('div');
            separator.className = 'separator';
            item.after(separator);
        }
    });
}


function toggleRedZone(element) {
    const parent = element.closest('.content_cube_maliste_mobile');
    const redZoneDelete = parent.nextElementSibling;
    if (redZoneDelete.classList.contains('show')) {
        redZoneDelete.style.width = '0';
        redZoneDelete.style.opacity = '0';
        setTimeout(() => {
            redZoneDelete.classList.remove('show');
            redZoneDelete.style.width = '0';
            parent.style.marginLeft = "0"
        }, 10);
    } else {
        redZoneDelete.style.display = 'flex';
        setTimeout(() => {
            redZoneDelete.classList.add('show');
            redZoneDelete.style.width = '64px';
            redZoneDelete.style.opacity = '1';
            parent.style.marginLeft = "-32px"
        }, 10);
    }
}


function validateCGV() {
    const checkbox = document.getElementById('cgv');
    const errorDiv = document.getElementById('contentErrCgv');
    errorDiv.style.display = 'none';
    if (!checkbox.checked) {

        errorDiv.style.display = 'flex';
        return false;
    } else {
        errorDiv.style.display = 'none';
        return true;
    }
}

function validateCGVMobile() {
    const checkbox = document.getElementById('cgv2');
    const errorDiv = document.getElementById('contentErrCgvMobile');
    errorDiv.style.display = 'none';
    if (!checkbox.checked) {

        errorDiv.style.display = 'flex';
        return false;
    } else {
        errorDiv.style.display = 'none';
        return true;
    }
}

const moteurrecherche = document.getElementById('moteurrecherche');
const inputSearchHeader = document.querySelector('.form_searchbox');
if (moteurrecherche) {
    moteurrecherche.addEventListener('focus', () => {
        inputSearchHeader.classList.add('focused');
    });
    moteurrecherche.addEventListener('blur', () => {
        inputSearchHeader.classList.remove('focused');
    });
}


if (currentUrl.includes("/besoin-aide")) {
    document.addEventListener("DOMContentLoaded", () => {
        const blocSrchElements = document.querySelectorAll('.bloc-srch');
        const contentBlocSrchElements = document.querySelectorAll('.content-bloc-srch');
        const contentSchElements = document.querySelectorAll('.content-sch');
        const searchResults = document.getElementById('searchResults');

        blocSrchElements.forEach(bloc => {
            bloc.addEventListener('click', handleClick);
        });

        handleResize();

        window.addEventListener('resize', handleResize);

        const searchInput = document.getElementById('searchInput');
        const searchAide = document.querySelector('.search-aide');



        document.getElementById('searchButton').addEventListener('click', performSearch);
        document.getElementById('searchInput').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        document.getElementById('searchInput').addEventListener('input', function () {
            if (this.value.trim() === '') {
                resetToActiveOnly();
            }
        });

        // Ajoutez les écouteurs d'événements focus et blur pour le style
        searchInput.addEventListener('focus', () => {
            searchAide.classList.add('focused');
        });

        searchInput.addEventListener('blur', () => {
            searchAide.classList.remove('focused');
        });

        function handleResize() {
            const isLargeScreen = window.innerWidth > 991;
            contentBlocSrchElements.forEach(element => {
                const children = Array.from(element.children);
                children.forEach(child => {
                    if (isLargeScreen) {
                        element.parentElement.insertBefore(child, element);
                        element.style.display = 'none';
                    } else {
                        element.appendChild(child);
                        element.style.display = 'block';
                    }
                });
            });

            if (isLargeScreen && blocSrchElements.length > 0) {
                activateElement(blocSrchElements[0]);
            } else {
                deactivateAll();
            }
        }

        function deactivateAll() {
            blocSrchElements.forEach(bloc => {
                bloc.classList.remove('actif-search', 'active');
                bloc.classList.add('bloc-srch');
                const img = bloc.querySelector('img');
                if (img && !img.getAttribute('src').includes('-orange.svg')) {
                    img.setAttribute('src', img.getAttribute('src').replace('.svg', '-orange.svg'));
                }
            });
            contentSchElements.forEach(content => content.classList.remove('active'));
        }

        function activateElement(element) {
            deactivateAll();
            element.classList.add('actif-search');
            element.classList.remove('bloc-srch');
            const img = element.querySelector('img');
            if (img) {
                img.setAttribute('src', img.getAttribute('src').replace('-orange.svg', '.svg'));
            }
            const targetId = element.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        }

        function handleClick(event) {
            const element = event.currentTarget;
            const targetId = element.getAttribute('data-target');
            if (window.innerWidth > 991) {
                activateElement(element);
                resetToActiveOnly();
            } else {
                blocSrchElements.forEach(bloc => {
                    if (bloc !== element) {
                        bloc.classList.remove('active');
                        const otherTargetId = bloc.getAttribute('data-target');
                        const otherContentElement = document.getElementById(otherTargetId);
                        otherContentElement.style.display = 'none';
                        document.body.appendChild(otherContentElement);
                    }
                });

                element.classList.toggle('active');
                const contentElement = document.getElementById(targetId);
                if (element.classList.contains('active')) {
                    element.parentNode.insertBefore(contentElement, element.nextSibling);
                    contentElement.style.display = 'block';
                } else {
                    contentElement.style.display = 'none';
                    document.body.appendChild(contentElement);
                }
            }
            if (searchInput.value.trim() !== '') {
                searchInput.value = '';
                searchResults.style.display = "none"
            }
        }

        function performSearch() {
            const query = normalizeString(document.getElementById('searchInput').value.toLowerCase().trim());
            let anyResults = false;

            if (query) {
                const isLargeScreen = window.innerWidth > 991;

                searchResults.innerHTML = '';
                let resultsHTML = '';

                blocSrchElements.forEach(bloc => {
                    bloc.classList.remove('actif-search');
                    bloc.classList.add('bloc-srch');
                    const img = bloc.querySelector('img');
                    if (img && !img.getAttribute('src').includes('-orange.svg')) {
                        img.setAttribute('src', img.getAttribute('src').replace('.svg', '-orange.svg'));
                    }
                });

                contentSchElements.forEach(content => {
                    const questions = content.querySelectorAll('.list-ques2');
                    let matchFound = false;

                    questions.forEach(question => {
                        const title = normalizeString(question.querySelector('h5').textContent.toLowerCase());
                        const description = normalizeString(question.querySelector('small').textContent.toLowerCase());

                        if (title.includes(query) || description.includes(query)) {
                            question.style.display = 'block';
                            matchFound = true;
                            anyResults = true;

                            if (!isLargeScreen) {
                                resultsHTML += `<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 list-ques2" onclick="toggleAccordeonFaq(this)">${question.innerHTML}</div>`;
                            }
                        } else {
                            if (isLargeScreen) {
                                question.style.display = 'none';
                            }
                        }
                    });

                    if (matchFound) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                });

                if (!isLargeScreen) {
                    searchResults.style.display = 'block';
                    if (anyResults) {
                        searchResults.innerHTML = resultsHTML;
                    } else {
                        searchResults.innerHTML = `Aucun résultat pour votre recherche : <span>${query}</span>`;
                    }
                }
            } else {
                resetToActiveOnly();
            }
        }

        function normalizeString(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        function resetToActiveOnly() {
            contentSchElements.forEach(content => {
                if (content.classList.contains('active')) {
                    content.style.display = 'block';
                    const questions = content.querySelectorAll('.list-ques2');
                    questions.forEach(question => {
                        question.style.display = 'block';
                    });
                    const correspondingBloc = document.querySelector(`[data-target="${content.id}"]`);
                    if (correspondingBloc) {
                        correspondingBloc.classList.add('actif-search');
                        correspondingBloc.classList.remove('bloc-srch');
                        const img = correspondingBloc.querySelector('img');
                        if (img) {
                            img.setAttribute('src', img.getAttribute('src').replace('-orange.svg', '.svg'));
                        }
                    }
                } else {
                    content.style.display = 'none';
                }
            });

            blocSrchElements.forEach(bloc => {
                if (!bloc.classList.contains('actif-search')) {
                    bloc.classList.add('bloc-srch');
                    const img = bloc.querySelector('img');
                    if (img && !img.getAttribute('src').includes('-orange.svg')) {
                        img.setAttribute('src', img.getAttribute('src').replace('.svg', '-orange.svg'));
                    }
                }
            });

            if (window.innerWidth <= 991) {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
            }
        }

    });
}



if (currentUrl.includes("/pieces-de-puzzle-manquantes")) {
    document.addEventListener('DOMContentLoaded', function() {
        var cubMarqs = document.querySelectorAll('.cub-marq');
        var allCubMarqs = document.querySelectorAll('.sp-marq');
        var backButton = document.querySelector('.back-missing-puzzle-pieces');
        var blocExMs = document.querySelectorAll('.bloc-ex-m');
        var arianFil = document.querySelector('.arian-marq');

        function hideAllBlocs() {
          blocExMs.forEach(function(bloc) {
            bloc.style.display = 'none';
          });
        }

        function showCubMarqs() {
          allCubMarqs.forEach(function(allCubMarqs) {
            allCubMarqs.classList.add('show');
          });
          arianFil.style.display = 'block'
        }

        function hideCubMarqs() {
          allCubMarqs.forEach(function(allCubMarqs) {
            allCubMarqs.classList.remove('show');
          });
          arianFil.style.display = 'none'
        }

        cubMarqs.forEach(function(cubMarq) {
          cubMarq.addEventListener('click', function() {
            hideAllBlocs();
            hideCubMarqs();
            var targetId = cubMarq.getAttribute('data-target');
            var targetBloc = document.getElementById(targetId);
            if (targetBloc) {
              targetBloc.style.display = 'flex';
              $("html, body").animate({scrollTop: 0},"smooth");
            }
            backButton.style.display = 'flex';
          });
        });

        backButton.addEventListener('click', function(event) {
          event.preventDefault();
          hideAllBlocs();
          showCubMarqs();
          backButton.style.display = 'none';
        });
      });

}
let lastFocusedElement;
if (document.getElementById('cartLink')) {
    document.getElementById('cartLink').addEventListener('click', function(event) {
        if (window.innerWidth > 991) {
            lastFocusedElement = document.activeElement;
            var modalPanier = document.getElementById('modal-panier');

            modalPanier.style.display = 'flex';
            document.body.classList.add('modal-open');

            disableBackgroundElements(modalPanier);
            trapFocusModal(modalPanier);
        }
    });
}

function trapFocusModal(modal) {
    const focusableElements = modal.querySelectorAll('button, a, select');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    modal.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

function disableBackgroundElements(modal) {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    focusableElements.forEach(el => {
        if (!modal.contains(el)) {
            el.setAttribute('tabindex', '-1');
        }
    });
}

function restoreBackgroundElements() {
    const focusableElements = document.querySelectorAll('[tabindex="-1"]');

    focusableElements.forEach(el => {
        el.removeAttribute('tabindex');
    });
}

// document.querySelector('.close-modal-panier').addEventListener('click', function() {
//     document.getElementById('modal-panier').style.display = 'none';
//     restoreBackgroundElements()
//     if (lastFocusedElement) {
// 		lastFocusedElement.focus();
// 	}
//     document.body.classList.remove('modal-open');
// });

// window.addEventListener('click', function(event) {
//     var modalPanier = document.getElementById('modal-panier');
//     if (event.target == modalPanier) {
//         modalPanier.style.display = 'none';
//         restoreBackgroundElements()
//         if (lastFocusedElement) {
//             lastFocusedElement.focus();
//         }
//         document.body.classList.remove('modal-open');
//     }
// });




function toggleTextMarque(btn, marque) {
    const contenuTexte = btn.previousElementSibling; // Cible l'élément juste avant le bouton

    if (contenuTexte.classList.contains('expanded')) {
        contenuTexte.classList.remove('expanded');
        btn.innerText = 'Voir plus sur ' + marque;
    } else {
        contenuTexte.classList.add('expanded');
        btn.innerText = 'Voir moins sur ' + marque;
    }
}

$('#iprincipale').on('click', function() {
    let currentImageIndex = $(this).attr('data-current-index');
    $.fancybox.open($('[data-fancybox="gallery"]'), {
        buttons: ['close'],
        loop: true,
        protect: false,
        baseClass: 'custom-fancybox',
        animationEffect: "zoom",
        transitionEffect: "slide",
        infobar: false,
        caption: function(instance, item) {
            return '';
        },
        thumbs: {
            autoStart: true,
            axis: 'y'
        },
        afterShow: function(instance, current) {
            var thumbsContainer = $('.fancybox-thumbs');
            if (thumbsContainer.length) {
                thumbsContainer.appendTo('.fancybox-inner');
            }
        },
        afterLoad  : function(instance, current) {
            current.width = 909;
        current.height = 659;
        },
        index: currentImageIndex,
        hash: false
    });
});
$('.slider-image-produit').on('click', '.slick-active img', function() {
    let currentImageIndexMobile = $(this).data('index');
    $.fancybox.open($('[data-fancybox="gallery"]'), {
        buttons: ['close'],
        loop: true,
        protect: true,
        baseClass: 'custom-fancybox',
        animationEffect: "zoom",
        transitionEffect: "slide",
        infobar: false,
        caption: function(instance, item) {
            return '';
        },
        thumbs: {
            autoStart: true,
            axis: 'y'
        },
        afterShow: function(instance, current) {
            var thumbsContainer = $('.fancybox-thumbs');
            if (thumbsContainer.length) {
                thumbsContainer.appendTo('.fancybox-inner');
            }
        },
        index: currentImageIndexMobile,
        hash: false
    });
});

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname === "/clients/") {
        var wishlistLink = document.querySelector('.logo-coeur');
        var userLink = document.querySelector('.logo-user')
        if (window.location.search === "?pg=maliste") {
            wishlistLink.classList.add("wishlist-active");
        } else {
            wishlistLink.classList.remove("wishlist-active");
            userLink.classList.add("user-active");
        }
    }
});

const buttons = document.querySelectorAll('.filter-button');
if (buttons) {
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(btn => {
                btn.classList.remove('active');
                btn.querySelector('img').src = btn.querySelector('img').src.replace('_white', '');
                btn.querySelector('span').style.color = '';
            });
            button.classList.add('active');
            const img = button.querySelector('img');
            img.src = img.src.replace('.svg', '_white.svg');
            button.querySelector('span').style.color = 'white';
            filterCommandes(button.id.replace('filter-', ''));
        });
    });
    filterCommandes('en_traitement');
}

function filterCommandes(status) {
    var commandes = document.querySelectorAll('.commande');
    commandes.forEach(function(commande) {
        if (commande.getAttribute('data-status') === status) {
            commande.style.display = 'flex';
        } else {
            commande.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login')) {
        openModal();
    }
});


function setActiveVignette(element, srcZoom700, srcZoom, key) {
    // Changer l'image principale
    $('#iprincipale').attr('src', srcZoom700);
    $('#iprincipale').data('zoom-image', srcZoom);
    $('#iprincipale').attr('data-current-index', key);
    //call_zoom(srcZoom);

    // Retirer la classe active de toutes les vignettes
    $('.vignette').removeClass('active');

    // Ajouter la classe active à la vignette cliquée
    $(element).addClass('active');
}
if($('.vignette')) {
    $('.vignette').first().addClass('active');
}



function adjustElementWidth() {
    if (window.innerWidth > 991) {
        const elements = document.querySelectorAll('.slick-list:not(.premium .slick-list)');
        elements.forEach(element => {
            const parentElement = element.parentElement;
            const lastConsultationDiv = document.querySelector('.last-consultation');
            if (parentElement && lastConsultationDiv) {
                const style = getComputedStyle(lastConsultationDiv);
                const marginLeft = parseFloat(style.marginLeft);
                element.style.width = `calc(100vw - ${marginLeft}px)`;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    adjustElementWidth();
});
window.addEventListener('resize', adjustElementWidth);


$(document).ready(function() {
    // Récupérer l'état des cases à cocher depuis le localStorage
    var cgvChecked = localStorage.getItem('cgvChecked') === 'true';
    // Mettre à jour l'état des cases à cocher
    $('.cgv-checkbox').prop('checked', cgvChecked);

    // Masquer les messages d'erreur si les cases sont cochées
    if (cgvChecked) {
        $('#errCgv').hide();
        $('#errCgvMobile').hide();
    }

    // Avant de quitter la page, vérifier l'URL et supprimer l'élément du localStorage si nécessaire
    $(window).on('beforeunload', function() {
        var currentUrl = window.location.href;
        if (!currentUrl.includes('/caddie/') && !currentUrl.includes('/checkout/')) {
            localStorage.removeItem('cgvChecked');
            localStorage.removeItem('mode_livraison');
            localStorage.removeItem('z_mode_livraison');
            localStorage.removeItem('acceptSupplierMailInfo');
        }
    });

    // Lorsque l'état des cases à cocher change
    $('.cgv-checkbox').change(function() {
        var isChecked = this.checked;
        // Mettre à jour l'état de toutes les cases à cocher
        $('.cgv-checkbox').prop('checked', isChecked);
        // Enregistrer l'état dans le localStorage
        localStorage.setItem('cgvChecked', isChecked);

        // Masquer ou afficher les messages d'erreur
        if (isChecked) {
            $('#errCgv').hide();
            $('#errCgvMobile').hide();
        } else {
            $('#errCgv').show();
            $('#errCgvMobile').show();
        }
    });
});


$('#nextetape').click(function(e) {
    var cgvChecked = $('#cgv').is(':checked');
    if (!cgvChecked) {
        e.preventDefault();
        $('#errCgv').show();
    } else {
        if (idSite == 2) {
            $.ajax({
                url: '/websvc/check_connection.ws.php',
                method: 'GET',
                success: function(response) {
                    if (response.connected) {
                        window.location.href = '/caddie/?pg=etape2';
                    } else {
                        openModal();
                    }
                }
            });
        }
    }
    return false;
});
$('#nextetapeMobile').click(function(e) {
    var cgvChecked = $('#cgv2').is(':checked');
    if (!cgvChecked) {
        e.preventDefault();
        $('#errCgvMobile').show();
    } else {
        if (idSite == 2) {
            $.ajax({
                url: '/websvc/check_connection.ws.php',
                method: 'GET',
                success: function(response) {
                    if (response.connected) {
                        window.location.href = '/caddie/?pg=etape2';
                    } else {
                        openModal();
                    }
                }
            });
        }
    }
    return false;
});

////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    $('label.radio-btn').on('keydown', function(e) {
        if (e.key === 'Enter') {
            var inputId = $(this).attr('for');
            // Check the associated input
            $('#' + inputId).prop('checked', true).trigger('change');
            validateForm();
        }
    });
});

function validateForm() {
    var deliveryMode = $('input[name=mode_livraison]:checked').val();
    var addressValid = $('#adresse-livr input').filter(function() {
        return $.trim($(this).val()).length > 0;
    }).length > 0;
    var acceptSupplierMailInfoChecked = $('input[name=acceptSupplierMailInfo]').is(':checked');
    var errorMessageVisible = $('#error-message-adresse').is(':visible');

    if (deliveryMode !== undefined && addressValid && acceptSupplierMailInfoChecked && !errorMessageVisible) {
        $('.btn-pass-pan').prop('disabled', false);
        $('#click-overlay').css('pointer-events', 'none');
        $('#error-message').hide();
    } else {
        $('.btn-pass-pan').prop('disabled', true);
        $('#click-overlay').css('pointer-events', 'auto');
    }
}

// Fonction pour enregistrer z_mode_livraison et mode_livraison dans le localStorage
function saveZModeLivraisonAndPOI(zModeLivraison, modeLivraison) {
    localStorage.setItem('z_mode_livraison', zModeLivraison);
    localStorage.setItem('mode_livraison', modeLivraison);
}

// Fonction pour enregistrer uniquement mode_livraison dans le localStorage
function saveModeLivraison(modeLivraison) {
    localStorage.setItem('mode_livraison', modeLivraison);
    localStorage.removeItem('z_mode_livraison');
}

function restoreSelections() {
    var zModeLivraison = localStorage.getItem('z_mode_livraison');
    var modeLivraison = localStorage.getItem('mode_livraison');
    var acceptSupplierMailInfo = localStorage.getItem('acceptSupplierMailInfo');

    if (zModeLivraison) {
        $('input[name="z_mode_livraison"][value="' + zModeLivraison + '"]').prop('checked', true);
    }

    if (modeLivraison) {
        if (zModeLivraison) {
            $('input[name="mode_livraison"].POI_radio[value="' + modeLivraison + '"]').prop('checked', true);
        } else {
            $('input[name="mode_livraison"][value="' + modeLivraison + '"]').prop('checked', true);
        }
    }

    if (acceptSupplierMailInfo) {
        $('input[name="acceptSupplierMailInfo"][value="' + acceptSupplierMailInfo + '"]').prop('checked', true);
    }

    validateForm();
}

$('input[name=z_mode_livraison]').on('change', function() {
    var zModeLivraison = $(this).val();
    localStorage.removeItem('mode_livraison');
    localStorage.setItem('z_mode_livraison', zModeLivraison);
});

// Gestion du choix du mode_livraison (avec classe POI_radio)
$(document).on('click','input[name="mode_livraison"]',function() {
    var modeLivraison = $(this).val();
    var zModeLivraison = $('input[name="z_mode_livraison"]:checked').val();

    if (zModeLivraison) {
        saveZModeLivraisonAndPOI(zModeLivraison, modeLivraison);
    } else {
        saveModeLivraison(modeLivraison);
    }

    validateForm();
});

$('input[name=acceptSupplierMailInfo]').on('change', function() {
    var acceptSupplierMailInfo = $('input[name=acceptSupplierMailInfo]:checked').val();
    if (acceptSupplierMailInfo) {
        localStorage.setItem('acceptSupplierMailInfo', acceptSupplierMailInfo);
    } else {
        localStorage.removeItem('acceptSupplierMailInfo');
    }
    validateForm();
});


// Gestion du choix direct du mode_livraison sans passer par z_mode_livraison
$('input[name=mode_livraison]:not(.POI_radio)').on('change', function() {
    var modeLivraison = $(this).val();
    saveModeLivraison(modeLivraison);
    validateForm();
});

$(document).on('focus', 'input[name="mode_livraison"], input[name="z_mode_livraison"], input[name="acceptSupplierMailInfo"]', function() {
    $(this).on('keydown', function(e) {
        if (e.key === 'Tab') {
            validateForm();
        }
    });
});


function restoreSelectionsWhenReady() {
    var interval = setInterval(function() {
        if ($('input[name="mode_livraison"].POI_radio').length > 0) {
            restoreSelections();
            clearInterval(interval);
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    restoreSelections();
    restoreSelectionsWhenReady();
    validateForm();
});

$('#fetape3_paiements').on('submit', function() {
    localStorage.removeItem('mode_livraison');
    localStorage.removeItem('z_mode_livraison');
    localStorage.removeItem('acceptSupplierMailInfo');
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const recapMobileFixe = document.querySelector('.recap-mobile-fixe');
    const contentTotal = document.querySelector('#contentTotal');

    function checkScroll() {
        const contentTotalPosition = contentTotal.getBoundingClientRect().top + window.scrollY;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition > contentTotalPosition) {
                recapMobileFixe.style.display = 'none';
        } else {
                recapMobileFixe.style.display = 'flex';
        }
    }
    if (recapMobileFixe) {
        window.addEventListener('scroll', checkScroll);
        checkScroll();
    }
});

document.addEventListener('DOMContentLoaded', function() {
	function checkScroll() {
		if (window.innerWidth > 991 && cartItems.length > 4) {
			const recapPanWRect = recapPanW.getBoundingClientRect();
			const lastCartItem = cartItems[cartItems.length - 1];
			const lastCartItemRect = lastCartItem.getBoundingClientRect();
			const summaryHeight = summaryContent.offsetHeight;

			const offsetTop = recapPanWRect.top + window.scrollY;
			const offsetBottom = lastCartItemRect.bottom + window.scrollY;

			if (initialTop === null) {
				initialTop = cartSummary.getBoundingClientRect().top + window.scrollY;
			}

			if (window.scrollY >= offsetTop) {
				if (window.scrollY + summaryHeight >= offsetBottom) {
					cartSummary.classList.add('fixed-recap');
					cartSummary.style.position = 'absolute';
					cartSummary.style.top = `${offsetBottom - summaryHeight}px`;
					cartSummary.style.width = '365.25px';
				} else {
					cartSummary.classList.remove('fixed-recap');
					cartSummary.style.position = 'fixed';
					cartSummary.style.top = '20px';
					cartSummary.style.width = '365.25px';
				}
			} else {
				cartSummary.classList.remove('fixed-recap');
				cartSummary.style.position = 'absolute';
				cartSummary.style.top = `${initialTop}px`;
				cartSummary.style.width = '365.25px';
			}
		}
	}

	const recapPanW = document.querySelector('.recap-pan-w');
	const cartItems = document.querySelectorAll('.cart-items .cart-item');
	const cartSummary = document.querySelector('.content-recap-panier');
	const summaryContent = document.querySelector('.summary-content');

	let initialTop = null;
	if (summaryContent) {
		checkScroll();
		window.addEventListener('scroll', checkScroll);
		window.addEventListener('resize', checkScroll);
	}

});


document.querySelectorAll('.input-focused').forEach(addFocusBlurListeners);

function addFocusBlurListeners(input) {
  input.addEventListener('focus', (event) => {
    event.target.classList.add('focused');
  });

  input.addEventListener('blur', (event) => {
    event.target.classList.remove('focused');
  });
}

document.addEventListener('focus', (event) => {
  if (event.target.matches('.input-focused')) {
    event.target.classList.add('focused');
  }
}, true);

document.addEventListener('blur', (event) => {
  if (event.target.matches('.input-focused')) {
    event.target.classList.remove('focused');
  }
}, true);


function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + '€';
}

function updatePriceDisplay(newPrice) {
    const priceDisplay = document.getElementById('price-display');
    const totalProduitPort = document.getElementById('total-produit-port');
    const initialTotal = parseFloat(document.getElementById('subtotal-display').getAttribute('data-subtotal-display'));
    const formattedNewPrice = parseFloat(newPrice.replace(',', '.'));

    if (priceDisplay && totalProduitPort) {
        priceDisplay.innerHTML = formatPrice(formattedNewPrice);
        totalProduitPort.innerHTML = formatPrice(initialTotal + formattedNewPrice);
    }
}

function changeLivraisonText() {
    const livraisonText = document.querySelector('.text-livraison');
    if (livraisonText && livraisonText.textContent.includes('Livraison à partir de')) {
        livraisonText.textContent = 'Livraison';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const radioInputs = document.querySelectorAll('input.radio-livraison');
    let firstChange = true;

    radioInputs.forEach(input => {
        if (input.checked) {
            changeLivraisonText();
            firstChange = false;
        }
    });

    radioInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const selectedInput = event.target;
            const newPrice = selectedInput.getAttribute('data-price-ml');

            if (newPrice) {
                updatePriceDisplay(newPrice);
                if (firstChange) {
                    changeLivraisonText();
                    firstChange = false;
                }
            }
        });
    });
});

$(document).ready(function() {
    $('#newsletter-form').on('submit', function(e) {
        e.preventDefault();
        var email = $('input[name="nl_email"]').val();
        if (email === '') {
            $('#error-message').show();
            return;
        }
        $('#error-message').hide();
        $.ajax({
            type: 'POST',
            url: '/infos/?pg=newsletter',
            data: {
                nl: 'inscription',
                nl_email: email
            },
            success: function(response) {
                $('#confirmation-message').show();
            },
            error: function() {
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    });
});

if (document.getElementById('same-address-checkbox')) {
    const facturationInitialValues = {
        nom: document.getElementById('facturation-nom').getAttribute('data-facturation-nom'),
        prenom: document.getElementById('facturation-nom').getAttribute('data-facturation-prenom'),
        societe: document.getElementById('facturation-societe').getAttribute('data-facturation-societe'),
        adresse1: document.getElementById('facturation-adresse1').getAttribute('data-facturation-adresse1'),
        adresse2: document.getElementById('facturation-adresse2').getAttribute('data-facturation-adresse2'),
        adresse3: document.getElementById('facturation-adresse3').getAttribute('data-facturation-adresse3'),
        ville: document.getElementById('facturation-cp-ville').getAttribute('data-facturation-ville'),
        cp: document.getElementById('facturation-cp-ville').getAttribute('data-facturation-cp'),
        pays: document.getElementById('facturation-pays').getAttribute('data-facturation-pays'),
        paysIso: document.getElementById('facturation-pays').getAttribute('data-facturation-pays-iso'),
        portable: document.getElementById('facturation-portable').getAttribute('data-facturation-portable')
    };

    const livraisonElements = {
        nom: document.getElementById('livraison-nom').getAttribute('data-livraison-nom'),
        prenom: document.getElementById('livraison-nom').getAttribute('data-livraison-prenom'),
        societe: document.getElementById('livraison-societe').getAttribute('data-livraison-societe'),
        adresse1: document.getElementById('livraison-adresse1').getAttribute('data-livraison-adresse1'),
        adresse2: document.getElementById('livraison-adresse2').getAttribute('data-livraison-adresse2'),
        adresse3: document.getElementById('livraison-adresse3').getAttribute('data-livraison-adresse3'),
        ville: document.getElementById('livraison-cp-ville').getAttribute('data-livraison-ville'),
        cp: document.getElementById('livraison-cp-ville').getAttribute('data-livraison-cp'),
        pays: document.getElementById('livraison-pays').innerText,
        paysIso: document.getElementById('livraison-pays').getAttribute('data-livraison-pays'),
        portable: document.getElementById('livraison-portable').getAttribute('data-livraison-portable')
    };

    // Fonction pour comparer les valeurs des deux adresses
    function adressesIdentiques(livraison, facturation) {
        return livraison.nom === facturation.nom &&
            livraison.prenom === facturation.prenom &&
            livraison.societe === facturation.societe &&
            livraison.adresse1 === facturation.adresse1 &&
            livraison.adresse2 === facturation.adresse2 &&
            livraison.adresse3 === facturation.adresse3 &&
            livraison.ville === facturation.ville &&
            livraison.cp === facturation.cp &&
            livraison.paysIso === facturation.paysIso &&
            livraison.portable === facturation.portable;
    }

    // Fonction pour remplir les champs de facturation
    function remplirChampsFacturation(data) {
        document.getElementById('facturation-nom').innerText = `${data.prenom} ${data.nom}`;
        document.getElementById('facturation-societe').innerText = data.societe || '';
        document.getElementById('facturation-adresse1').innerText = data.adresse1 || '';
        document.getElementById('facturation-adresse2').innerText = data.adresse2 || '';
        document.getElementById('facturation-adresse3').innerText = data.adresse3 || '';
        document.getElementById('facturation-cp-ville').innerText = `${data.cp} ${data.ville}`;
        document.getElementById('facturation-pays').innerText = data.pays;
        document.getElementById('facturation-portable').innerText = data.portable ? `Portable : ${data.portable}` : '';
    }

    // Fonction pour remplir les champs cachés
    function remplirChampsCaches(data) {
        document.getElementById('hidden-facturation-nom').value = data.nom;
        document.getElementById('hidden-facturation-prenom').value = data.prenom;
        document.getElementById('hidden-facturation-societe').value = data.societe;
        document.getElementById('hidden-facturation-adresse1').value = data.adresse1;
        document.getElementById('hidden-facturation-adresse2').value = data.adresse2;
        document.getElementById('hidden-facturation-adresse3').value = data.adresse3;
        document.getElementById('hidden-facturation-ville').value = data.ville;
        document.getElementById('hidden-facturation-cp').value = data.cp;
        document.getElementById('hidden-facturation-pays').value = data.paysIso;
        document.getElementById('hidden-facturation-portable').value = data.portable;
    }

    if (adressesIdentiques(livraisonElements, facturationInitialValues)) {
        document.getElementById('same-address-checkbox').checked = true;
    }

    document.getElementById('same-address-checkbox').addEventListener('change', function () {
        if (this.checked) {
            remplirChampsFacturation(livraisonElements);
            remplirChampsCaches(livraisonElements);
        } else {
            remplirChampsFacturation(facturationInitialValues);
            remplirChampsCaches(facturationInitialValues);
        }
    });

    document.getElementById('same-address-checkbox').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.checked = !this.checked;
            this.dispatchEvent(new Event('change'));
        }
    });

}


// Navigation par tabulation (au clavier)

$('.bouton-pp').on('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('telecharger-image-pp').click();
    }
});

$('.switch').on('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const checkbox = $(this).find('input[type="checkbox"]');
        checkbox.prop('checked', !checkbox.prop('checked')).trigger('change');
    }
});

document.querySelectorAll('label').forEach(function(label) {
    label.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const checkbox = document.getElementById(label.htmlFor);
            checkbox.checked = !checkbox.checked;
        }
    });
});


$('#voir-tout').on('keydown', function(e) {
    if (e.key === 'Enter') {
        afficherToutesMarques();
    }
});

document.querySelectorAll('.capitale').forEach(function(letterElement) {
    letterElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const letter = this.getAttribute('data-letter');
            filtrerParCapitale(letter);
        }
    });
});


function setTabindex(container, value) {
    const focusableElements = container.querySelectorAll('a, button, input, [tabindex]');
    focusableElements.forEach(function (element) {
        if (value === -1) {
            element.setAttribute('tabindex', '-1');
        } else {
            element.removeAttribute('tabindex');
        }
    });
}

function trapTabKey(container) {
    const focusableElements = container.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

function handleKeydown(event, arrowId, blockId, contentBlockId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleProduit(arrowId, blockId, contentBlockId);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const puzzleList = document.getElementById('puzzle_list');
    const puzzleOptions = document.querySelectorAll('.puzzle-option');
    let currentIndex = -1;
    const changefSelect =  document.querySelector('.change-f-select');

    if(changefSelect) {
        changefSelect.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePuzzleList();
                if (puzzleList.style.display === 'block') {
                    currentIndex = -1;
                }
            }

            if (puzzleList.style.display === 'block') {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % puzzleOptions.length;
                    puzzleOptions[currentIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + puzzleOptions.length) % puzzleOptions.length;
                    puzzleOptions[currentIndex].focus();
                }
            } else {
                if (e.key === 'Enter' && currentIndex >= 0) {
                    e.preventDefault();
                    if (puzzleOptions[currentIndex]) {
                        selectPuzzle(puzzleOptions[currentIndex]);
                    }
                }
            }
        });
        document.addEventListener('click', function(event) {
            const puzzleSelectContainer = document.getElementById('puzzle_select_container');
            if (!puzzleSelectContainer.contains(event.target)) {
                puzzleList.style.display = 'none';
            }
        });
    }

});

const togglePasswordIcons = document.querySelectorAll('.togglePassword');

togglePasswordIcons.forEach(icon => {
  icon.addEventListener('click', function () {
    const passwordInput = this.previousElementSibling;
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    const currentSrc = this.getAttribute('src');
    this.setAttribute('src', currentSrc === '/images/eye-empty.svg' ? '/images/eye-filled.svg' : '/images/eye-empty.svg');
  });
});

function updateBlock(element, maxHeight, rowElement, addClass, removeClass, arrowElement, arrowSrc) {
    if (element) {
        element.style.maxHeight = maxHeight;
    }
    if (rowElement) {
        rowElement.classList.add(addClass);
        rowElement.classList.remove(removeClass);
    }
    if (arrowElement) {
        arrowElement.src = arrowSrc;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("/premium.html")) {
        const params = new URLSearchParams(window.location.search);
        const idMarqueSelectionnee = params.get("mar");
        if (idMarqueSelectionnee) {
            const slider = $(".slider.premium");
            const marqueItems = document.querySelectorAll(".marque-item");
            let index = Array.from(marqueItems).findIndex(item => item.dataset.idMarque === idMarqueSelectionnee );
            if (index !== -1) {
                setTimeout(() => {
                    slider.slick("slickGoTo", index-1);
                }, 500);
            }
        }
    }
});


function shareProduct() {
    var url = window.location.href;
    var text = "Découvrez ce produit : " + url;
    var whatsapp = "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
    var facebook = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
    var email = "mailto:?subject=Découvrez ce produit&body=" + encodeURIComponent(text);

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    var existingModal = document.getElementById("shareModal");
    if (existingModal) {
            existingModal.style.display = "flex";
            return;
    }

    var modal = document.createElement("div");
    modal.id = "shareModal";
    modal.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center;
        align-items: center; z-index: 1000; animation: fadeIn 0.3s;
    `;

    var modalContent = document.createElement("div");
    modalContent.style = `
        background: white; padding: 20px; border-radius: 10px;
        width: 350px; text-align: center; position: relative;
        box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
    `;

    modalContent.innerHTML = `
        <span id="closeModal" style="position: absolute; top: 10px; right: 15px; font-size: 20px;cursor: pointer; color: black; font-weight: bold;">✖</span>
        <h1 itemprop="name" class="libelle-produit" style="margin-bottom: 15px;">
            <span style="font-weight: 600;">Partager ce produit</span>
        </h1>
        ${isMobile ? `<a href="${whatsapp}" target="_blank" style="display: block; margin: 10px 0; padding: 8px; background: #25d366; color: white;border-radius: 5px; text-decoration: none; font-weight: bold;">WhatsApp</a>` : ''}
        <a href="${facebook}" target="_blank" style="display: block; margin: 10px 0; padding: 8px; background: #0064E0; color: white;border-radius: 5px; text-decoration: none; font-weight: bold;">Facebook</a>
        <a href="${email}" target="_blank" style="display: block; margin: 10px 0; padding: 8px; background: #359AA5; color: white;border-radius: 5px; text-decoration: none; font-weight: bold;">Email</a>
        <button onclick="copyToClipboard('${url}')" style="width: 100%; padding: 8px; background: #333; color: white;border-radius: 5px; border: none; cursor: pointer; font-weight: bold; font-size: 14px;height: 36px;">Copier l'URL</button>
        <p id="copyMessage" style="color:#333; font-weight: bold; display: none; margin-top: 10px;">Lien copié !</p>
`   ;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById("closeModal").onclick = function () {
        modal.style.display = "none";
    };

    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        var message = document.getElementById("copyMessage");
        message.style.display = "block";
        setTimeout(() => { message.style.display = "none"; }, 2000);
    }, function(err) {
        console.error("Erreur lors de la copie : ", err);
    });
}


$(document).ready(function() {
    $('.select-product').each(function() {
        var $this = $(this);
        var isInModal = $this.closest('.modal').length > 0;
        $this.select2({
            dropdownAutoWidth: true,
            width: '48px',
            minimumResultsForSearch: Infinity,
            dropdownCss: {
                'max-height': '150px',
                'overflow-y': 'auto'
            },
            dropdownParent: isInModal ? $this.closest('.modal') : $('body')
        });
    });
});
