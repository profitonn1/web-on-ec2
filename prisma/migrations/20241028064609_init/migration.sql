-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "signin" BOOLEAN NOT NULL DEFAULT false,
    "joinedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalAutomaticHistory" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "playerOneUserName" TEXT NOT NULL,
    "playerTwoUserName" TEXT NOT NULL,
    "playerThreeUserName" TEXT,
    "playerFourUserName" TEXT,
    "first" TEXT NOT NULL,
    "second" TEXT NOT NULL,
    "third" TEXT,
    "fourth" TEXT,

    CONSTRAINT "TotalAutomaticHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalchallengeHistory" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "challengedBy" TEXT NOT NULL,
    "challengedTo" TEXT NOT NULL,
    "winner" TEXT NOT NULL,

    CONSTRAINT "TotalchallengeHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFullDetails" (
    "id" TEXT NOT NULL,
    "nooftimespaired" TEXT NOT NULL,
    "averageroc" TEXT NOT NULL,
    "winRate" TEXT NOT NULL DEFAULT '0/0',
    "Ranking" TEXT NOT NULL,
    "balanceINR" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "UserFullDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEachMatchDetails" (
    "id" TEXT NOT NULL,
    "profit" TEXT NOT NULL,
    "playingwith" TEXT NOT NULL,
    "aftergameamount" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "UserEachMatchDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCurrentPairedDetails" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isPaired" BOOLEAN NOT NULL DEFAULT false,
    "opponentId" TEXT,
    "amount" TEXT,
    "category" TEXT NOT NULL,

    CONSTRAINT "UserCurrentPairedDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeGameRangeDetails" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "paired" BOOLEAN DEFAULT false,
    "categoryChosen" TEXT NOT NULL,
    "betStartRange" TEXT,
    "betEndRange" TEXT,
    "askStartRange" TEXT,
    "askEndRange" TEXT,
    "opponentId" TEXT,

    CONSTRAINT "ChallengeGameRangeDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeResendGameRangeDetails" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "betStartRange2" TEXT,
    "betEndRange2" TEXT,
    "askStartRange2" TEXT,
    "askEndRange2" TEXT,

    CONSTRAINT "ChallengeResendGameRangeDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TotalAutomaticHistory_id_key" ON "TotalAutomaticHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TotalchallengeHistory_id_key" ON "TotalchallengeHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserFullDetails_id_key" ON "UserFullDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserEachMatchDetails_id_key" ON "UserEachMatchDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserCurrentPairedDetails_id_key" ON "UserCurrentPairedDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserCurrentPairedDetails_authorId_key" ON "UserCurrentPairedDetails"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeGameRangeDetails_id_key" ON "ChallengeGameRangeDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeResendGameRangeDetails_id_key" ON "ChallengeResendGameRangeDetails"("id");

-- AddForeignKey
ALTER TABLE "UserFullDetails" ADD CONSTRAINT "UserFullDetails_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEachMatchDetails" ADD CONSTRAINT "UserEachMatchDetails_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCurrentPairedDetails" ADD CONSTRAINT "UserCurrentPairedDetails_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeGameRangeDetails" ADD CONSTRAINT "ChallengeGameRangeDetails_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeResendGameRangeDetails" ADD CONSTRAINT "ChallengeResendGameRangeDetails_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "ChallengeGameRangeDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
