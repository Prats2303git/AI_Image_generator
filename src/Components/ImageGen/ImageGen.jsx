import { useRef, useState } from "react";
import "./ImageGen.css";
import default_image from "../Assets/detective-hat-coat-is-standing-table-holding-phone_1095508-1295.jpg"
import React from "react";

export default function ImageGen()
{
    let [image_url,setImage_url] = useState("/");
    let inputRef = useRef(null);
    let [loading,setLoading] = useState(false);

    let imageGenerator = async ()=>{
        if(inputRef.current.value==="")
            return 0;

        setLoading(true);
        let res = await fetch(
            "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
		    {
                method: "POST",
                headers: { 
                    Authorization: process.env.MY_API_KEY,
                    "Content-Type" : "application/json",
                 },
                body: JSON.stringify({
                    "text_prompts": [
                        {
                            "text" : `${ inputRef.current.value }`
                        }
                    ],
                    "cfg_scale": 7,
                    "height": 512,
                    "width": 512,
                    "steps": 30,
                    "samples": 1
                })
		    }
        );
        const result = await res.json();
        let data_array = result.artifacts;
        let data = "data:image/png;base64,"+data_array[0].base64;
        setImage_url(data);
        setLoading(false);
    };


    return(
        <div className="AI-image-gen">
            <div className="header">
                AI Image <span>Generator</span> 
            </div>
            <div className="image">
                <div className="image-source"><img src={image_url==="/"?default_image:image_url} /></div>
                <div className="img-loading">
                    <div className={loading?"loadingbar-full":"loadingbar"}></div>
                </div>
            </div>
            <div className="search-box">
                <input type="text" ref={inputRef} className="search-input" placeholder="Describe what you want to generate "/>
                <div className="generate-btn" onClick={()=>{imageGenerator()}}>Generate</div>
            </div>
        </div>
    )
}