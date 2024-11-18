import upload from '~/config/upload'

const uploadSingleFileMiddleware = upload.single('file')

export default uploadSingleFileMiddleware
