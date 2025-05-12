<?php

namespace App\Controller;

use Sylius\Component\Order\Context\CartContextInterface;
use Sylius\Component\Order\Repository\OrderItemRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sylius\Component\Order\Modifier\OrderItemQuantityModifierInterface;
use Sylius\Component\Order\Processor\OrderProcessorInterface;


class CartItemController extends AbstractController
{
    private CartContextInterface $cartContext;
    private OrderItemRepositoryInterface $itemRepository;
    private OrderItemQuantityModifierInterface $orderItemQuantityModifier;
    private OrderProcessorInterface $orderProcessor;
    private EntityManagerInterface $entityManager;

    public function __construct(
        CartContextInterface $cartContext,
        OrderItemRepositoryInterface $itemRepository,
        OrderItemQuantityModifierInterface $orderItemQuantityModifier,
        OrderProcessorInterface $orderProcessor,
        EntityManagerInterface $entityManager
    ) {
        $this->cartContext                 = $cartContext;
        $this->itemRepository              = $itemRepository;
        $this->orderItemQuantityModifier   = $orderItemQuantityModifier;
        $this->orderProcessor              = $orderProcessor;
        $this->entityManager               = $entityManager;
    }

    /**
     * @Route(
     *     "/{_locale}/cart/items/{id}",
     *     name="app_cart_item_remove",
     *     methods={"DELETE"},
     *     requirements={"_locale": "[A-Za-z]{2,4}(_[A-Za-z]{2})?"}
     * )
     */
    public function remove(Request $request, int $id): RedirectResponse
    {
        $cart = $this->cartContext->getCart();
        $item = $this->itemRepository->find($id);

       // if ($item && $cart->hasItem($item)) {
            $cart->removeItem($item);
            $this->entityManager->flush();
     //   }

        $referer = $request->headers->get('referer');
        $url = $referer ?: $this->generateUrl('sylius_shop_cart_summary');

        return $this->redirect($url);

    }

    /**
     * @Route(
     *     "/{_locale}/cart/items/{id}/quantity",
     *     name="app_cart_item_update_quantity",
     *     methods={"POST"},
     *     requirements={"_locale": "[A-Za-z]{2,4}(_[A-Za-z]{2})?"}
     * )
     */
    public function updateQuantity(Request $request, int $id): RedirectResponse
    {
        $cart = $this->cartContext->getCart();
        $item = $this->itemRepository->find($id);

        if (!$item || !$cart->hasItem($item)) {
            throw $this->createNotFoundException('Cart item not found.');
        }

        $formData = $request->request->all('sylius_cart_item');
        $quantity = isset($formData['quantity']) ? (int) $formData['quantity'] : 0;

        if ($quantity < 1) {
            $this->addFlash('error', 'Quantity must be at least 1.');
            return $this->redirectToRoute('sylius_shop_cart_summary');
        }

        $this->orderItemQuantityModifier->modify($item, $quantity);
        $this->orderProcessor->process($cart);
        $this->entityManager->flush();

        $referer = $request->headers->get('referer');
        $url = $referer ?: $this->generateUrl('sylius_shop_cart_summary');

        return $this->redirect($url);
    }


}
