import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular/dataform-directives";
import { EntityProperty, DataFormEventData } from "nativescript-ui-dataform";
import { Article } from "~/model/Article";
import { ConduitService } from "~/service/ConduitService";
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import * as Toast from "nativescript-toast";
import { localize } from "nativescript-localize";
import { RadAutoCompleteTextViewComponent } from "nativescript-ui-autocomplete/angular/autocomplete-directives";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";

@Component({
    selector: "conduit-edit-article",
    moduleId: module.id,
    templateUrl: "./edit-article.component.html",
    styleUrls: ["./edit-article.component.css"],
    providers: [ConduitService]
})
export class EditArticleComponent implements OnInit {
    /** */
    public title: string;
    /** */
    public article: Article;
    /** */
    public isLoading: boolean = false;
    /** */
    private feedback: Feedback;
    /** */
    @ViewChild("formArticle") protected formArticle: RadDataFormComponent;
    /** */
    @ViewChild("tagsField") protected tagsField: RadAutoCompleteTextViewComponent;

    private tags: Array<TokenModel> = new Array<TokenModel>();

    /**
     *
     * @param router
     * @param route
     */
    constructor(private router: Router, private route: ActivatedRoute, private conduit: ConduitService) {
        this.feedback = new Feedback();
        this.route.params.subscribe(params => {
            if (params["slug"]) {
                this.isLoading = true;
                this.title = localize("article.edit");
                this.conduit.getArticle(params["slug"]).subscribe(
                    (article: Article) => {
                        this.article = article;
                        article.tagList.forEach(tag => {
                            this.tags.push(new TokenModel(tag, null));
                        });
                    },
                    error => {
                        console.log(error);
                    },
                    () => {
                        this.isLoading = false;
                    }
                );
            } else {
                this.title = localize("article.add");
                this.article = new Article();
            }
        });
    }

    /**
     *
     */
    public ngOnInit() {
        this.conduit.getTags().subscribe((tags: string[]) => {
            tags.forEach(tag => {
                this.tags.push(new TokenModel(tag, null));
            });
        });

        this.tagsField.autoCompleteTextView.loadSuggestionsAsync = text => {
            let items: Array<TokenModel> = Object.assign([], this.tags);
            let promise = new Promise((resolve, reject) => {
                if (text !== "") {
                    items.push(new TokenModel(text, null));
                    resolve(items);
                } else {
                    reject();
                }
            });
            return promise;
        };
    }

    /**
     *
     */
    public onBack() {
        this.router.navigate(["/home"]);
    }

    /**
     *
     * @param args
     */
    public onTokenAdded(args) {
        this.article.tagList.push(args.token.text);
    }

    /**
     *
     * @param args
     */
    public onTokenRemoved(args) {
        delete this.article.tagList[args.token.text];
    }

    /**
     *
     */
    public onSave() {
        this.formArticle.dataForm.validateAll().then(result => {
            if (result) {
                this.isLoading = true;
                this.conduit.addArticle(this.article.title, this.article.description, this.article.body, ...this.article.tagList).subscribe(
                    (article: Article) => {
                        this.feedback.success({
                            title: "Article saved!",
                            message: article.title
                        });
                    },
                    error => {
                        this.feedback.error({
                            title: localize("error.general"),
                            message: error
                        });
                    },
                    () => {
                        this.isLoading = false;
                        this.onBack();
                    }
                );
            }
        });
    }

    /**
     *
     */
    get tagsProvider(): Array<TokenModel> {
        return this.tags;
    }
}
