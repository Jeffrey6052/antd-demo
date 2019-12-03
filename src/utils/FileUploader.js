
class FileUploader {

    constructor() {
        this.files = {}
    }

    chooseFile(args = {}) {
        const tArgs = {
            accept = false,
            multiple = false,
            name = "file",
            ...args
        }

        const input = document.createElement('input');
        input.type = 'file'

        if (tArgs.accept) {
            input.accept = tArgs.accept
        }

        if (tArgs.multiple) {
            input.multiple = 'multiple'
        }

        input.onchange = e => {
            const upFiles = e.target.files
            if (upFiles.length > 1) {
                this.addFile(upFiles, tArgs.name)
            } else if (upFiles.length == 1) {
                this.addFile(upFiles[0], tArgs.name)
            }
        }
        input.click()
    }

    chooseMultiFile(args = {}) {
        const tArgs = {
            ...args,
            multiple = true
        }
        this.chooseFile(tArgs)
    }

    addFile(file, name = "file") {
        this.files[name] = file
    }

    clear() {
        this.files = {}
    }

    getToken(){
        
    }

    submit(args = {}) {

        const tArgs = {
            onProgress = this.doNothing,
            onLoaded = this.doNothing,
            onSuccess = this.doNothing,
            onFailure = this.doNothing,
            addToken = true,
            ...args
        }

        const { url, data, onProgress, onLoaded, onSuccess, onFailure, addToken } = tArgs

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        headers['X-Requested-With'] = 'XMLHttpRequest'
        headers['Content-Type'] = 'multipart/form-data'

        this.files.forEach((name, file) => {
            formData.append(name, file)
        })

        if (data) {
            data.forEach((name, value) => {
                formData.append(name, value)
            })
        }

        // headers['X-File-Size'] = file.size
        // headers['X-File-Type'] = file.type
        xhr.open(method, addToken ? objToUrl(url, { token: getToken() }) : url);
        Object.entries(headers).map(([k, v]) => xhr.setRequestHeader(k, v))
        xhr.upload.onprogress = e => doNothing(e)
            if (e.lengthComputable) {
                const percent = e.loaded / e.total * 100
                onProgress && onProgress(percent)
            }
        }
        xhr.upload.onloadend = e => doNothing(e)
        xhr.send(formData);
    }

    doNothing() {
    }
}

export default FileUploader