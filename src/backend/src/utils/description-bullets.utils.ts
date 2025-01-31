import prisma from '../prisma/prisma';
import { isLeadership } from 'shared';
import { Work_Package, Description_Bullet } from '@prisma/client';
import { HttpException } from './errors.utils';

export const hasBulletCheckingPermissions = async (userId: number, descriptionId: number) => {
  const user = await prisma.user.findUnique({ where: { userId } });

  const descriptionBullet = await prisma.description_Bullet.findUnique({
    where: { descriptionId },
    include: {
      workPackageDeliverables: { include: { wbsElement: { include: { projectLead: true, projectManager: true } } } },
      workPackageExpectedActivities: { include: { wbsElement: { include: { projectLead: true, projectManager: true } } } }
    }
  });

  if (!descriptionBullet) return false;

  if (!user) return false;

  const leader =
    descriptionBullet.workPackageDeliverables?.wbsElement.projectLead ||
    descriptionBullet.workPackageExpectedActivities?.wbsElement.projectLead;
  const manager =
    descriptionBullet.workPackageDeliverables?.wbsElement.projectManager ||
    descriptionBullet.workPackageExpectedActivities?.wbsElement.projectManager;

  if (isLeadership(user.role) || (leader && leader.userId === user.userId) || (manager && manager.userId === user.userId)) {
    return true;
  }
  return false;
};

/**
 * Validates that there are no unchecked expected activities or delivrerables
 * @param workPackage Work package to check bullets for
 * @throws if there are any unchecked expected activities or deliverables
 */
export const throwIfUncheckedDescriptionBullets = (
  workPackage: Work_Package & { expectedActivities: Description_Bullet[]; deliverables: Description_Bullet[] }
) => {
  // if it's a work package, all deliverables and expected activities must be checked
  const { expectedActivities, deliverables } = workPackage;

  // checks for any unchecked expected activities, if there are any it will return an error
  if (expectedActivities.some((element) => element.dateTimeChecked === null && element.dateDeleted === null))
    throw new HttpException(400, `Work Package has unchecked expected activities`);

  // checks for any unchecked deliverables, if there are any it will return an error
  const uncheckedDeliverables = deliverables.some(
    (element) => element.dateTimeChecked === null && element.dateDeleted === null
  );
  if (uncheckedDeliverables) throw new HttpException(400, `Work Package has unchecked deliverables`);
};
