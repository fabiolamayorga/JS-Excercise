/**
 * Creates a Gallery
 * class represents a gallery
 * @param {string} galleryParent Parent of the gallery reference.
 * @param {string} selectedIndex Index of the selected slide reference,
 * @param {array} galleryData Populates the data from the fetch service, 
 */

import * as service from "./service";

export default class Gallery {

    constructor(gp) {
        this.galleryParent = gp;
        this.selectedIndex = 1;
        this.galleryData = [];
    };

    /** 
    * Render the thumbnails
    * @param {array} galleryData
    */

    renderThumbs(galleryData) {
        let html = "";
        let data = galleryData;

        data.forEach(galleryItem => {
            html += `<li data-id=${galleryItem.id} class="gallery-item ${galleryItem.id == 1 ? 'selected' : ''}">
                        <img src='${galleryItem.picture}' alt="${galleryItem.description}"/>
                    </li>`;
        });

        return `<ul class="gallery-items"> ${html} </ul>`;
    }

    /** 
    * Render the big image above the thumbnails
    * @param {number} image to render
    */

    renderFullImage(currentImage) {
        return `<div class="full-image">
                    <img class="current-image" src="${currentImage}" />
                        <button class="control disable prev" data-type="prev"></button>
                        <button class="control next" data-type="next"></button>
                </div>`;
    }

    /** 
    * Render the thumbnails and the full image all together
    * @param {array} galleryData
    */
    render(galleryData) {
        let html = "";
        let data = galleryData || this.galleryData;
        let currentImage = data.find(item => item.id == this.selectedIndex );

        this.galleryParent.innerHTML = `
            ${this.renderFullImage(currentImage.picture)}
            ${this.renderThumbs(data)} 
        `
    }

    /** 
    * Update the index of the nw image slide
    * @param {number} index
    */

    updateCurrentImage(index) {
        this.selectedIndex = parseInt(index);
        let data = this.galleryData;
        let currentImage = data.find(item => item.id == this.selectedIndex );
        let image = document.querySelector('.current-image');

        image.src = currentImage.picture;
    }

    /** 
    * Adds the event handlers to the needed buttons
    */

    addEventHandlers() {
        let galleryItems = document.querySelectorAll('.gallery-item');
        let controls = document.querySelectorAll('.control');

        for (let i = 0; i < galleryItems.length; i++){
            galleryItems[i].addEventListener("click", e => this.onThumbClick(e), false);
        }

        for (let j = 0; j < controls.length; j++){
            controls[j].addEventListener("click", e => this.onControlsClick(e), false);
        }

    }

    /** 
    * Function triggered when thumbs are clicked
    */

    onThumbClick(e) {
        let currentSelected = document.querySelector('.selected');
        let prevButton = document.querySelector('.prev');
        let nextButton = document.querySelector('.next');
        prevButton.classList.remove('disable');
        nextButton.classList.remove('disable');
        this.updateCurrentImage( e.currentTarget.dataset.id);
        currentSelected.classList.remove('selected');
        e.currentTarget.classList.add('selected');

        if (e.currentTarget.dataset.id == 1) {
            prevButton.classList.add('disable');
        }else if (e.currentTarget.dataset.id == 5) {
            nextButton.classList.add('disable');
        } 
    }

    /** 
    * Function triggered when previous and next buttons are clicked
    */

    onControlsClick(e) {
        let element = e.currentTarget;
        let elementType = element.dataset.type;
        let isPrev = (elementType == "prev" ? true : false);

        if (document.querySelector('.disable')) {
            document.querySelector('.disable').classList.remove('disable');
        }

        this.updateCurrentImage(isPrev ? this.selectedIndex-1 : this.selectedIndex+1);
        this.updateButtonsState(e.currentTarget);
        this.updateCursorPosition(isPrev);       
    }

    /** 
    * Function that updates the status to be wether disabled or not
    *  @param {object} button
    */

    updateButtonsState(button) {
        if (this.selectedIndex === 1 || this.selectedIndex === 5) {
            button.classList.add('disable');
        }
    }

    /** 
    * Function that checks if the previous or next thumb should be selected
    *  @param {boolean} isPrev
    */

    updateCursorPosition(isPrev) {
        let currentSelected = document.querySelector('.selected');
        currentSelected.classList.remove('selected');
        if (isPrev) {
            currentSelected.previousSibling.classList.add('selected');
        }else {
            currentSelected.nextSibling.classList.add('selected');
        }
    }
 
    /** 
    * Function that fetchs the necessary data for the gallery
    *  @param {boolean} isPrev
    */

    fetchData() {
        service.findAll()
            .then(galleryData => {
                this.galleryData = galleryData;
                this.render(galleryData);
                this.addEventHandlers();
            })
            .catch(error => console.log(error)
        );
    }

    init() {
        this.fetchData();
    }
} 

const galleryParent = document.getElementById('gallery');
const gallery = new Gallery(galleryParent);
gallery.init();


