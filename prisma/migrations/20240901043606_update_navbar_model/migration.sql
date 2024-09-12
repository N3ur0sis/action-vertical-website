/*
  Warnings:

  - You are about to drop the `_PageContentToNavbar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "NavbarItem_parentId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PageContentToNavbar";
PRAGMA foreign_keys=on;

-- RedefineIndex
DROP INDEX "PageContent_pageId_idx";
CREATE INDEX "pageId_idx" ON "PageContent"("pageId");
