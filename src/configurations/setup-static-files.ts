import { resolve } from 'path'
import express, { Express } from 'express'

export const setupStaticFiles = (app: Express) => {
  const uploadDirPath = resolve('public/uploads')

  app.use('/uploads', express.static(uploadDirPath))
}
