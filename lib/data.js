/*
* Library for storing and editing data
* */

const {open, writeFile, close, readFile, truncate, unlink} = require("fs");
const {join} = require("path");

const lib = {};

lib.baseDir = join(__dirname, "/../.data");


/**
 * @param {string} dir
 * @param {string} file
 * @param {string} data
 * */
lib.create = (dir, file, data) => {
    return new Promise((resolve, reject)=>{
        const filePath = join(lib.baseDir, dir, `${file}.json`);
        // open file for writing
        open(filePath, "wx", (err, fileDescriptor) => {
            if (err) return reject(new Error("Couldn't create a new file, it may already exists."));

            const stringData = JSON.stringify(data);

            truncate(fileDescriptor, err => {
                if (err) return reject("Error truncating file.");
                writeFile(fileDescriptor, stringData, err => {
                    if (err) return reject("Error writing to new file.");
                    close(fileDescriptor, err=>{
                        if (err) return reject("Error closing new file.");
                        resolve();
                    });
                });
            });
        });
    });
};

/**
 * @param {string} dir
 * @param {string} file
 * */
lib.read = (dir, file) => {
    return new Promise((resolve, reject)=>{
        const filePath = join(lib.baseDir, dir, `${file}.json`);
        readFile(filePath, "utf-8", (err, data) => {
            if (err) return reject("Error reading file.");
            resolve(data);
        });
    });
};

/**
 * @param {string} dir
 * @param {string} file
 * @param {string} data
 * */
lib.update = (dir, file, data) => {
    return new Promise((resolve, reject)=>{
        const filePath = join(lib.baseDir, dir, `${file}.json`);
        // open file for writing
        open(filePath, "r+", (err, fileDescriptor) => {
            if (err) return reject(new Error("Couldn't open file for update. It may not exists."));
            const stringData = JSON.stringify(data);
            writeFile(fileDescriptor, stringData, err => {
                if (err) return reject("Error writing to new file.");
                close(fileDescriptor, err=>{
                    if (err) return reject("Error closing new file.");
                    resolve();
                });
            });
        });
    });
};

/**
 * @param {string} dir
 * @param {string} file
 * */
lib.delete = (dir, file) => {
    return new Promise((resolve, reject)=>{
        const filePath = join(lib.baseDir, dir, `${file}.json`);
        unlink(filePath, "utf-8", (err, data) => {
            if (err) return reject("Error deleting file.");
            resolve(data);
        });
    });
};



module.exports = lib;