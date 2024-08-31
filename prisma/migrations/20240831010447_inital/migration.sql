-- CreateEnum
CREATE TYPE "PlayerPositions" AS ENUM ('Goalkeeper', 'Defender', 'Midfielder', 'Forward');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "img" JSONB,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "squadNumber" INTEGER,
    "position" "PlayerPositions" NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closingDate" TIMESTAMP(3) NOT NULL,
    "img" JSONB,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "selectedPlayerId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayerToPoll" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_key_key" ON "Player"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToPoll_AB_unique" ON "_PlayerToPoll"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToPoll_B_index" ON "_PlayerToPoll"("B");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_selectedPlayerId_fkey" FOREIGN KEY ("selectedPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToPoll" ADD CONSTRAINT "_PlayerToPoll_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToPoll" ADD CONSTRAINT "_PlayerToPoll_B_fkey" FOREIGN KEY ("B") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
