/**
 * Base service for all API calls
 */

 import Configstore from "configstore";
 import { AuthToken } from './auth/Auth.interface.js';
 import fetch from 'node-fetch';
 
 const BaseService = (config: Configstore) => {
     const serviceUrl = config.get('serviceUrl');
     const credentials: AuthToken = config.get('credentials');
     const version = "v3"; // todo: config option
 
     const Fetch = async(method: string, path: string, body: object | null | undefined) => {
         if (!serviceUrl) {
             throw 'Service URL not set, re-run auth command';
         }
       
         if (!credentials) {
             throw 'You must run the auth command first to initialize the CLI';
         }

         let data = body !== null && body !== undefined
            ? JSON.stringify(body)
            : null;
 
         return await fetch(`https://${serviceUrl}/${version}/${path}`, {
             method,
             body: data,
             headers: {
               Authorization: `Bearer ${credentials.access_token}`,
               'Content-Type': 'application/json',
             },
         });
     }
 
     const Get = async(path: string) => {
         return await Fetch("get", path, null);
     }
 
     const Post = async(path: string, body: object | null | undefined) => {
         return await Fetch("post", path, body);
     }
 
     const Put = async(path: string, body: object | null | undefined) => {
         return await Fetch("put", path, body);
     }
 
     const Delete = async(path: string, body: object | null | undefined) => {
         return await Fetch("delete", path, body);
     }
 
     return {
         Fetch,
         Get,
         Post,
         Put,
         Delete,
     };
 }
 
 export { BaseService };