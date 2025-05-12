<?php


namespace App\Controller;

use App\Repository\Shipping\PickupPointRepository;
use Sylius\Bundle\ShippingBundle\Doctrine\ORM\ShippingMethodRepository;
use Sylius\Component\Channel\Context\ChannelContextInterface;
use Sylius\Component\Promotion\Repository\PromotionRepositoryInterface;
use Sylius\Component\Shipping\Repository\ShippingMethodRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CheckoutController extends AbstractController
{
    #[Route('/get-pickup-points/{methodCode}', name: 'get_pickup_points')]
    public function getPickupPoints(
        string $methodCode,
        PickupPointRepository $pickupPointRepository,
        ShippingMethodRepository $shippingMethodRepository
    ): JsonResponse {
        $method = $shippingMethodRepository->findOneBy(['code' => $methodCode]);

        if (!$method) {
            return new JsonResponse([], 404);
        }

        $points = $pickupPointRepository->findActiveByMethod($method);

        $data = array_map(fn($point) => [
            'id' => $point->getId(),
            'name' => $point->getName(),
            'street' => $point->getStreet(),
            'city' => $point->getCity(),
            'postalCode' => $point->getPostalCode(),
            'latitude' => $point->getLatitude(),
            'longitude' => $point->getLongitude()
        ], $points);

        return new JsonResponse($data);
    }
    #[Route('/get-pickup-points-by-postalcode/{methodCode}/{postalCode}', name: 'get_pickup_points-by-postalcode')]
    public function getPickupPointsByPostalCode(
        string $methodCode,
        int $postalCode,
        PickupPointRepository $pickupPointRepository,
        ShippingMethodRepository $shippingMethodRepository
    ): JsonResponse {
        $method = $shippingMethodRepository->findOneBy(['code' => $methodCode]);

        if (!$method) {
            return new JsonResponse([], 404);
        }

        $points = $pickupPointRepository->findActiveByMethodByPostalCode($method,$postalCode);

        $data = array_map(fn($point) => [
            'id' => $point->getId(),
            'name' => $point->getName(),
            'street' => $point->getStreet(),
            'city' => $point->getCity(),
            'postalCode' => $point->getPostalCode(),
            'latitude' => $point->getLatitude(),
            'longitude' => $point->getLongitude()
        ], $points);

        return new JsonResponse($data);
    }
    #[Route('/_ajax/promotion-threshold', name: 'app_promotion_threshold')]
    public function __invoke(
        PromotionRepositoryInterface $promotionRepository,
        ChannelContextInterface $channelContext
    ): JsonResponse {
        $channel = $channelContext->getChannel();
        $channelCode = $channel->getCode();

        $threshold = null;

        foreach ($promotionRepository->findByName('Free shipping') as $promotion) {
            foreach ($promotion->getRules() as $rule) {
                if ($rule->getType() === 'item_total') {
                    $config = $rule->getConfiguration();
                    if (isset($config[$channelCode]['amount'])) {
                        $threshold = $config[$channelCode]['amount'];
                        break 2; // Exit both loops after finding first matching threshold
                    }
                }
            }
        }

        return new JsonResponse([
            'threshold' => $threshold,
        ]);
    }
}
