
import FileUploader from "./FileUploader"

class TokenizedFileUploader extends FileUploader {

    constructor() {
        super()
    }

    submit(args = {}) {
        const tArgs = {
            data: {},
            ...args
        }

        tArgs.data.token = this.getToken()

        super.submit(tArgs)
    }

    getToken() {
        return "someToken"
    }

}

export default TokenizedFileUploader