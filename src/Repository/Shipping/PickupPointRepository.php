<?php

// src/Repository/Shipping/PickupPointRepository.php

namespace App\Repository\Shipping;

use App\Entity\Shipping\PickupPoint;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Sylius\Component\Shipping\Model\ShippingMethodInterface;

/**
 * @extends ServiceEntityRepository<PickupPoint>
 */
class PickupPointRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PickupPoint::class);
    }

    /**
     * Find all “active” points in a given Zone.
     *
     * @return PickupPoint[]
     */
    public function findActive(): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.active = true')
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
    public function findActiveByMethod(ShippingMethodInterface $method): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.shippingMethod = :method')
            ->andWhere('p.active = true')
            ->setParameter('method', $method)
            ->getQuery()
            ->getResult();
    }
    public function findActiveByMethodByPostalCode(ShippingMethodInterface $method, $postalCode): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.shippingMethod = :method')
            ->andWhere('p.postalCode BETWEEN :postalCodeMin AND :postalCodeMax')
            ->andWhere('p.active = true')
            ->setParameter('method', $method)
            ->setParameter('postalCodeMin', (int)$postalCode - 2)
            ->setParameter('postalCodeMax', (int)$postalCode + 2)
            ->getQuery()
            ->getResult();
    }
    /*public function findActiveByZone($zone): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.city = :zone')
            ->andWhere('p.active = true')
            ->setParameter('city', $zone)
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }*/
}
