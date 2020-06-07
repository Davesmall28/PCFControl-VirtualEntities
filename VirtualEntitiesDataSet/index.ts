import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class VirtualEntitiesDataSet implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
	private _url: string;
	private _container: HTMLDivElement;

	constructor()
	{
	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		if (context.parameters.webApiUrl.raw == null || context.parameters.webApiUrl.raw == "val") {
			throw new Error("Web Api Url is equal to null or default value");
		}

		VirtualEntitiesDataSet.prototype._url = context.parameters.webApiUrl.raw;
		VirtualEntitiesDataSet.prototype._container = container;
		context.mode.trackContainerResize(true);
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this.DoSomething();
	}

	private DoSomething(): void {
		var ajax = new XMLHttpRequest();
		ajax.onload = this.successCallback;
		ajax.onerror = this.errorCallback;
		ajax.open("GET", VirtualEntitiesDataSet.prototype._url, true);
		ajax.send();
	}

	public getOutputs(): IOutputs
	{
		return {};
	}

	public destroy(): void
	{
	}

	private successCallback()
	{
		var response:any = this;
		var responseData = JSON.parse(response["responseText"]);

		if (response.status == 200) { // request succeeded
			console.log("Get Columns");
			let _columns:string[] = VirtualEntitiesDataSet.prototype.getColumns(responseData);
			console.log("Get data");
			var _data = VirtualEntitiesDataSet.prototype.getData(responseData, _columns);
			console.log("create html table")
			var _htmlTable = VirtualEntitiesDataSet.prototype.createHtmlTable(_columns, _data);
			console.log(_htmlTable);
			var divOuter = document.createElement("div");
			divOuter.innerHTML = _htmlTable;
	
			VirtualEntitiesDataSet.prototype._container.appendChild(divOuter);
		}
	}

	private errorCallback(e:any)
	{
		console.log(this);
		console.error(e);
	}

	private getColumns(json: any): string[]
	{
		console.log("start");
		let bottomRowColumns:string[] = []; //Not Used for anthing yet.
		let columnsToReturn:string[] = [];
		console.log("start2");

		Object.keys(json).forEach(function(key1:string) {
			var val1 = json[key1];

			if (typeof(val1) != "object") {
				if (!columnsToReturn.includes(key1)) {
					columnsToReturn.push(key1);    
				}
			}

			if (typeof(val1) == "object") {
				Object.keys(val1).forEach(function(key2) {
					var val2 = val1[key2];

					if (typeof(val2) != "object") {
						if (!columnsToReturn.includes(key2)) {
							columnsToReturn.push(key2);    
						}
					}
			
					if (typeof(val2) == "object") {
						Object.keys(val2).forEach(function(key3) {
							let val3:any = val2[key3];

							if (typeof(val3) != "object") {
								if (!columnsToReturn.includes(key3)) {
									columnsToReturn.push(key3);
								}
							}

							if (typeof(val3) == "object") {
								Object.keys(val3).forEach(function(key4) {
									var val4 = val3[key4];

									if (VirtualEntitiesDataSet.checkObjectHasNoInnerObjects(val3)) {
										if (!bottomRowColumns.includes(key4)) {
											bottomRowColumns.push(key4);    
										}
									}

									if (typeof(val4) != "object") {
										if (!columnsToReturn.includes(key4)) {
											columnsToReturn.push(key4);
										}
									}
								});
							}
						});
					}
				});
			}
		});

		return columnsToReturn;
	}


	private getData(json : any, allColumns:string[])
	{
		let data: string[] = [];
		let level1Info:any = {};
		Object.keys(json).forEach(function (key1: string) {
			var level1 = json[key1];

			if (allColumns.includes(key1)) {
				level1Info[key1] = level1;
			}

			var level2Info:any = {};
			Object.keys(level1).forEach(function(key2) {
				var level2 = level1[key2];

				if (allColumns.includes(key2)) {
					level2Info[key2] = level2;
				}

				var level3Info:any = {};
				Object.keys(level2).forEach(function(key3) {
					var level3 = level2[key3];

					if (allColumns.includes(key3)) {
						level3Info[key3] = level3;
					}

					var level4Info:any = {};
					Object.keys(level3).forEach(function(key4) {
						var level4 = level3[key4];
		
						if (allColumns.includes(key4)) {
							level4Info[key4] = level4;
						}

						if (Object.keys(level4Info).length > 0 && level4Info.constructor === Object) {
							Object.keys(level3Info).forEach(function(keyLevel3Info) {
								level4Info[keyLevel3Info] = level3Info[keyLevel3Info]; 
							});

							Object.keys(level2Info).forEach(function(keyLevel2Info) {
								level4Info[keyLevel2Info] = level2Info[keyLevel2Info]; 
							});

							Object.keys(level1Info).forEach(function(keyLevel1Info) {
								level4Info[keyLevel1Info] = level1Info[keyLevel1Info]; 
							});

							if (!data.includes(level4Info)) {
								data.push(level4Info);
							}
						}
					});
				});
			});
		});

		return data;
	}

	private createHtmlTable(allColumns: string[], dataToPresent:any) {   
		var htmlTable = '<table>';

		allColumns.forEach(function (column:string) {
			htmlTable += '<th>'+ column +'</th>';    
		});
		
		dataToPresent.forEach(function (element:any) {
			htmlTable += '<tr>';

			allColumns.forEach(function (columnName:string) {
				htmlTable += '<td>'+ element[columnName] +'</td>';    
			});

			htmlTable += '</tr>';
		});
		
		htmlTable += '</table>';
		return htmlTable;
	}

	static checkObjectHasNoInnerObjects(obj: any)
	{
		let globVar = true;
		let hasProperty = false;
		if (obj === undefined) {
			throw new TypeError('this is null or not defined');
		}

		Object.keys(obj).forEach(function(key) {
			var typeOfObject = typeof(obj[key]);
			hasProperty = true;
			if (typeOfObject == "object") {
				globVar = false;
				return;
			}
		});

		if (hasProperty) {
			return globVar;
		}

		throw new TypeError('error of big porpotions');
	}
}