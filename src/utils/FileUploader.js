class FileUploader {

    constructor() {
        this.files = {}
    }

    chooseFile(args = {}) {
        const tArgs = {
            accept: false,
            name: "file",
            onSelect: this.donothing,
            ...args
        }

        const input = document.createElement('input')
        input.type = 'file'

        if (tArgs.accept) {
            input.accept = tArgs.accept
        }

        input.onchange = e => {
            const upFiles = e.target.files
            if (!upFiles.length) {
                return
            }

            let tFile = upFiles[0]
            this.addFile(tFile, tArgs.name)

            tArgs.onSelect(tFile)
        }
        input.click()
    }

    addFile(file, name = "file") {
        this.files[name] = file
    }

    deleteFile(name) {
        delete this.files[name]
    }

    clear() {
        this.files = {}
    }

    submit(args = {}) {
        const tArgs = {
            onProgress: this.donothing,
            onSuccess: this.donothing,
            onFailure: this.donothing,
            data: {},
            method: "post",
            ...args
        }

        if (tArgs.url == undefined) {
            throw "Missing url"
        }

        const xhr = new XMLHttpRequest()
        xhr.open(tArgs.method, tArgs.url)

        const formData = new FormData()
        Object.entries(this.files).forEach(tuple => formData.append(...tuple))
        Object.entries(tArgs.data).forEach(tuple => formData.append(...tuple))

        xhr.onprogress = e => tArgs.onProgress(e)
        xhr.onloadend = () => {
            if (xhr.status == 200) {
                tArgs.onSuccess(xhr.response)
            } else {
                tArgs.onFailure(xhr.status, xhr.response)
            }
        }

        xhr.send(formData)
    }

    donothing() {
    }
}

export default FileUploader