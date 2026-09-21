import { Component } from '@angular/core';

import { jqxDataTableModule, jqxDataTableComponent } from 'jqwidgets-ng/jqxdatatable';
@Component({
    selector: 'app-root',
    imports: [jqxDataTableModule],
    standalone: true,
    templateUrl: './app.component.html'
})

export class AppComponent {
    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '90%';
        }
        return 800;
    }

    source: any = {
        dataType: 'jsonp',
        dataFields: [
            { name: 'countryName', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'population', type: 'float' },
            { name: 'continentCode', type: 'string' }
        ],
        url: 'https://secure.geonames.org/searchJSON'
    };

    dataAdapter: any = new jqx.dataAdapter(this.source, {
        formatData: (data: any): any => {
            data.featureClass = 'P';
            data.style = 'full';
            data.username = 'jqwidgets';
            data.maxRows = 50;

            return data;
        }
    });

    columns: any[] = [
        { text: 'Country Name', dataField: 'countryName', width: 200 },
        { text: 'City', dataField: 'name', width: 250 },
        { text: 'Population', dataField: 'population', cellsFormat: 'f', width: 250 },
        { text: 'Continent Code', dataField: 'continentCode' }
    ];
}
