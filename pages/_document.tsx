import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head />
                <body className="dark">
                    <Main />
                    <NextScript />
                    <div id="modal-wrap"/>
                    <div id="overlay-wrap"/>
                </body>
            </Html>
        );
    }
}