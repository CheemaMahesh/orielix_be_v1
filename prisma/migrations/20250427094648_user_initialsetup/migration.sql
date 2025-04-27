-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Admin', 'Customer', 'TA', 'SuperAdmin', 'Creator');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "preferredName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "age" INTEGER,
    "address" TEXT,
    "phone" TEXT,
    "auraPoints" INTEGER NOT NULL,
    "zinPinCode" TEXT,
    "dob" TEXT,
    "userType" VARCHAR(255) NOT NULL DEFAULT 'Customer',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "about" TEXT,
    "profileImage" TEXT,
    "institution" TEXT NOT NULL,
    "fieldOfStudy" TEXT,
    "fieldDescription" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
