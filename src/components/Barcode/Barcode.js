import { BarcodeReader, BarcodeScanner } from "dynamsoft-javascript-barcode";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { isAdmin, ApiUrl } from '../../config'
import './Barcode.css'
import './styles.scss'

BarcodeReader.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNDgxMTIzLVRYbFhaV0pRY205cVgyUmljZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNDgxMTIzIiwiY2hlY2tDb2RlIjoxOTE5NjM1OTc1fQ==';
BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/";

const Barcode = () => {
    let scanner = null;
    let elRef = React.createRef();
    const [barcode, setBarcode] = useState()
    const [barcodeError, setBarcodeError] = useState({
        isError: false,  
        errorMsg: ''
    })
    const navigate = useNavigate()

  useEffect(() => {
    const loadBarcodeScanner = async () => {
        await BarcodeReader.loadWasm();
        scanner = await BarcodeScanner.createInstance()
        await scanner.setUIElement(elRef.current);
        scanner.onFrameRead = results => {
            console.log("Barcodes on one frame:");
            for (let result of results) {
                const format = result.barcodeFormat ? result.barcodeFormatString : result.barcodeFormatString_2;
                console.log(format + ": " + result.barcodeText);
            }
        };
        
        let processingBarCode = false
        async function processScannedResult(txt, barcodeObj) {
            if (!processingBarCode && barcodeObj) {
                processingBarCode = true;
                setBarcodeError({
                    isError: false,  
                    errorMsg: ''
                })
                let barcode = barcodeObj.barcodeText
                setBarcode(barcode)
                const format = barcodeObj.barcodeFormatString;
                if (format === 'QR_CODE') {
                    setBarcodeError({
                        isError: true,
                        errorMsg: 'QR Codes not supported. QR Code found ' + barcode
                    })
                    processingBarCode = false;
                    return;
                }
                new Audio('./scanner-beep.mp3').play();
                // barcode ='9317948008038' //'9300601013692';
                let product = await fetch(ApiUrl + '/barcode/' + barcode + '/' + isAdmin);
                product = await product.text();
                if (product !== 'barcodeNotFound') {
                    product = JSON.parse(product)
                    localStorage.setItem('localGroceryItem', JSON.stringify(product));
                    processingBarCode = false;
                    navigate('/product/' + product.id);
                } else {
                    setBarcodeError({
                        isError: true,
                        errorMsg: 'No product found for barcode ' + barcode
                    })   
                }
                processingBarCode = false;
            }
        }
                  
        scanner.onUniqueRead = processScannedResult
        let scanSettings = await scanner.getScanSettings();
        scanSettings.intervalTime = 100; // 100ms
        scanSettings.whenToPlaySoundforSuccessfulRead = "unique";
        scanSettings.whenToVibrateforSuccessfulRead = "unique";
        scanSettings.duplicateForgetTime = 3000; // 3s
        await scanner.updateScanSettings(scanSettings);
        // await scanner.open();
        scanner.show().catch(ex=>{
            console.log(ex);
            alert(ex.message || ex);
            scanner.hide();
        });
        // $rootScope.scanner = scanner;
      }
  
      loadBarcodeScanner()
        .catch(console.error)

      return async () => {
          if (scanner) {
              await scanner.destroyContext();
              console.log('BarcodeScanner Component Unmount');
          }
      }
    }, [])

  return (
    <div className="text-center"> 
    {/* <div className="centerbtn">
        <button ng-click="$root.goBack()" className="btn btn-primary" type="button">
        GO BACK
        </button>
    </div>     */}
    <p className="barcodescan">
        Scan the product barcode with your camera.
    </p>
    {
        barcode && 
        <div className="processingbarcode">
            Found Barcode <span className="barcode">{ barcode }</span><br/>
        </div>        
    }    
    {
        barcodeError.isError && 
        <div className="text-center nobarcodefound alert-danger">
            { barcodeError.errorMsg }     
        </div>        
    }
    {
       !barcode && 
        <div id="div-video-container" ref={elRef} className="component-barcode-scanner">
            <svg className="dce-bg-loading" viewBox="0 0 1792 1792"><path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z"></path></svg>
            <div className="dce-video-container"></div>
            <div className="dce-scanarea">
                <div className="dce-scanlight"></div>
            </div>
        </div>       
    }
    </div>
  );
}


export default Barcode;
