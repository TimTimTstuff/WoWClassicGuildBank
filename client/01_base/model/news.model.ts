
 interface NewsRecord {
    id:              number;
    title:           string;
    news_text:       string;
    category:        string;
    created_by:      string;
    created_on:      string;
    modified_by:     string;
    modified_on:     string;
    status:          number;
    owner:           number;
    publicpost:number;
    owner_ref:       Ref;
    created_by_ref:  Ref;
    modified_by_ref: Ref;
}


