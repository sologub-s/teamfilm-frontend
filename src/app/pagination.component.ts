import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Component({
    selector: 'my-pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {

    @Input() public criteria = new BehaviorSubject(null);
    @Input() public aria : string = '';
    @Input() public perBlock = 5;
    @Input() public perChunk = 10;
    @Input() public radius : number|null = null;
    @Output() public onActionEmitter = new EventEmitter<any>();

    public pagesArray = [];
    public activePages = [];
    public moreResultsAvailable : boolean = false;
    public page = [];
    public showLeftDispersion : boolean = false;
    public showRightDispersion : boolean = false;
    public leftDispersionPages = [];
    public rightDispersionPages = [];

    prevPage: number | null = null;
    nextPage: number | null = null;

    ngOnInit() {
        this.criteria.subscribe(criteria => {
            if(criteria) {
                this.showLeftDispersion = false;
                this.showRightDispersion = false;

                this.pagesArray = Array(criteria.totalPages).fill(0);
                this.page = Array.isArray(criteria.page) ? criteria.page : [criteria.page];

                this.activePages = [];
                for(let i = this.page[0] ; i <= this.page[this.page.length - 1]; i++) {
                    this.activePages.push(i);
                }
                this.prevPage = this.page[0] > 1 ? this.page[0] - 1 : null;
                this.nextPage = this.page[this.page.length - 1] < criteria.totalPages ? this.page[this.page.length - 1] + 1 : null;
                this.moreResultsAvailable = this.page[this.page.length - 1] < criteria.totalPages;

                if(this.radius && this.activePages[0] - this.radius > 1) {
                    this.showLeftDispersion = true;
                    this.leftDispersionPages = this.composeBlocks(1, this.activePages[0] - this.radius);
                }
                if(this.radius && this.activePages[this.activePages.length-1] + this.radius < criteria.totalPages) {
                    this.showRightDispersion = true;
                    this.rightDispersionPages = this.composeBlocks(this.activePages[this.activePages.length - 1] + this.radius, criteria.totalPages);
                }
            }
        });
    }

    composeBlocks (leftEdgePage, rightEdgePage) {
        let chunks = [];
        let c = 0;
        for (let i = leftEdgePage + 1; i < rightEdgePage; i++) {
            chunks[c] = chunks.length === 0 || chunks.length - 1 < c ? [] : chunks[c];
            if (i / this.perChunk === Math.ceil(i / this.perChunk) && chunks[c].length >= this.perChunk && leftEdgePage + 1 + i >= Math.ceil(this.perChunk / 2)) {
                c++;
                chunks[c] = [];
            }
            chunks[c].push(i);
        }

        let b = 0;
        let blocks = [];
        for(var i = 0 ; i < chunks.length ; i++) {
            blocks[b] = blocks.length === 0 || blocks.length - 1 < b ? {chunks:[]} : blocks[b];
            if (i / this.perBlock === Math.ceil(i / this.perBlock) && blocks[b].chunks.length >= this.perBlock && chunks.length - i >= Math.ceil(this.perBlock / 2)) {
                b++;
                blocks[b] = {chunks:[]};
            }
            blocks[b].chunks.push(chunks[i]);
            blocks[b].startPage = blocks[b].hasOwnProperty('startPage') ? blocks[b].startPage : chunks[i][0];
            blocks[b].endPage = chunks[i][chunks[i].length - 1];
            blocks[b].renderChunks = blocks[b].chunks.length === 1;
            for (let c = 0; c < blocks[b].chunks.length; c++) {
                blocks[b]['renderPages'+c] = blocks[b].chunks[c].length === 1;
            }
        }
        return blocks;
    }

    gotoPage(page) {
        this.onActionEmitter.emit({page: page});
    }

    loadMoreResults() {
        this.onActionEmitter.emit({page: [this.activePages[0], this.activePages[this.activePages.length - 1] + 1]});
    }
}