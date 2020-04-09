// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const request = require('request');
const iconv = require('iconv-lite');
const soap = require('soap');

var pool = [
            // 'sh000001',     
            // 'sz002462',     //jst
            // 'sz000887',      //zdgf
            'sz002510',     //tqm
            'sh603017',     //zhsj
            'sh603697',     //yysp
            'sz000815',     //mly
            // 'sh600096',     //yth
            'sz002549',     //kmtq
            // 'sh600512',     //tdjs
            // 'sz002572',     //sfy
            // 'sz300376',     //yst
            'sh600089',     //tbdg
            // 'sh600196',     //fxyy
            'sz000100',     //TCL
            // 'sz002234',     //mhgf
            'sz002139',     //tbgf
            'sz002444'      //xzky
            
        ];
var url;
var status = false;
// var i = 0;

function haveALook(){    
    var poolList = pool.join(',');
    url = 'http://hq.sinajs.cn/list=' + poolList;
    request({url: url, encoding: null}, function(error, response, body){
        // var showInfo = [" "];
        if(!error && response.statusCode == 200){
            var buf = iconv.decode(body,'GBK');
            var stockList = buf.split(';');
            stockList.pop();
            var showList = stockList.map(function(stockMes){
                var stock = stockMes.split("=")[1];
                var stockInfo = stock.split(",");
                // @ts-ignore
                var showStockInfo = stockInfo[0].substring(0,3)+":"+Math.round(stockInfo[3]*100)/100+","+Math.round((stockInfo[3]-stockInfo[2])/stockInfo[2]*10000,2)/100;
                // if(Math.round((stockInfo[3]-stockInfo[2])/stockInfo[2]*10000,2)/100 > 5 || Math.round((stockInfo[3]-stockInfo[2])/stockInfo[2]*10000,2)/100 < -5){
                //     vscode.window.showInformationMessage(showStockInfo);
                // }
                if (stockInfo[20] == '0' && Number(stockInfo[10])*Number(stockInfo[11]) < 20000000){                    
                    var banInfo = stockInfo[0].substring(0,3)+":"+Number(stockInfo[10])*Number(stockInfo[11])/10000+"万";
                    vscode.window.showInformationMessage(banInfo);
                }
                showStockInfo = showStockInfo.replace('"',"");
                return showStockInfo;
            })
            // var banList = stockList.map(function(stockMes){
            //     var stock = stockMes.split("=")[1];
            //     var stockInfo = stock.split(",");
            //     var banInfo;
            //     if (stockInfo[20] == '0'){
            //         banInfo = stockInfo[0].substring(0,3)+":"+Number(stockInfo[10])*Number(stockInfo[11]);
            //     }
            //     banInfo = banInfo.replace('"',"");
            //     return banInfo;
            // })
            var showInfo = showList.join(";");
            // var showInfoMes = showInfo[0];
            // vscode.window.showInformationMessage(showInfo[0]);
            // i = i + 1;
            vscode.window.setStatusBarMessage(showInfo);
            // vscode.window.setStatusBarMessage(body);

            // var showBanInfo = banList.join(";");
            // vscode.window.showInformationMessage(showBanInfo);
        }
    })
}

// var soap_url = "http://www.webxml.com.cn/WebServices/ChinaStockWebService.asmx?wsdl";
// var args = {theStockCode: 'sh601828'};
// function stock_soap() {
//     soap.createClient(soap_url, function (err, client) {
//         if (err){
//             vscode.window.showInformationMessage(err);
//         }
//         else{
//             client.getStockInfoByCode(args, function (err, result) {
//                 if (!err){
//                     vscode.window.showInformationMessage(result);
//                     vscode.window.setStatusBarMessage(result);
//                 }
//                 else{
//                     vscode.window.showInformationMessage(err);
//                 }            
//             })
//         }        
//     })    
// }

// function callApi(){
//     url = "http://192.168.10.120:5000/cnmi006";
//     var formData = {
//         "approver":'1172', 
//         "serialNumber":'110028', 
//         "requestid":'5904', 
//         "applicationYear":'202001', 
//         "plant":'TJNM', 
//         "action":'insert', 
//         "amoeba2":'40621', 
//         "remark":'123', 
//         "approvalTime":'2020-03-26', 
//         "applicationMonth":'202001', 
//         "paymentmoney":'50'
//     };
//     request({url:url,formData:formData, method:"POST"},function(error, response, body){
//         if (!error && response.statusCode==200){
//             var showInfo = body;
//             vscode.window.setStatusBarMessage(showInfo);
//         }
//         else{
//             vscode.window.showInformationMessage(error);
//         }

//     })
// }

var intervalHaveALook = setInterval(haveALook, 5000);
// var intervalHaveALook = setInterval(callApi, 5000);
// var intervalHaveALook = setInterval(stock_soap, 5000);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-mystock" is now active!');

    intervalHaveALook;
    status = true;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let closeLook = vscode.commands.registerCommand('extension.closeLook', function () {
		// The code you place here will be executed every time your command is executed

        clearInterval(intervalHaveALook);
        vscode.window.setStatusBarMessage('');
        status = false;
    });
    
    let openLook = vscode.commands.registerCommand('extension.openLook', function(){
        if (!status){
            intervalHaveALook = setInterval(haveALook, 5000);
            intervalHaveALook;
            status = true;
        }        
    });

    context.subscriptions.push(closeLook);
	context.subscriptions.push(openLook);
    
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
