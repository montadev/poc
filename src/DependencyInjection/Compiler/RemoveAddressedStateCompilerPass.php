<?php

declare(strict_types=1);

namespace App\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

class RemoveAddressedStateCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        // Cherchez la définition du workflow
        $definitionId = '.state_machine.sylius_order_checkout.definition';
        
        if (!$container->hasDefinition($definitionId)) {
            // Essayez avec d'autres noms possibles
            $possibleIds = [
                'state_machine.sylius_order_checkout.definition',
                'workflow.sylius_order_checkout.definition',
                '.workflow.sylius_order_checkout.definition'
            ];
            
            foreach ($possibleIds as $id) {
                if ($container->hasDefinition($id)) {
                    $definitionId = $id;
                    break;
                }
            }
        }
        
        if (!$container->hasDefinition($definitionId)) {
            return;
        }
        
        $definition = $container->getDefinition($definitionId);
        
        // Modifiez les places
        $places = $definition->getArgument(0);
        $newPlaces = [];
        
        foreach ($places as $key => $place) {
            if ($place !== 'addressed') {
                $newPlaces[] = $place;
            }
        }
        
        $definition->replaceArgument(0, $newPlaces);
        
        // Modifiez les transitions
        $transitions = $definition->getArgument(1);
        $newTransitions = [];
        
        foreach ($transitions as $transitionRef) {
            if (is_string($transitionRef) && $container->hasDefinition($transitionRef)) {
                $transitionDef = $container->getDefinition($transitionRef);
                $name = $transitionDef->getArgument(0);
                
                // Supprimez la transition 'address'
                if ($name === 'address') {
                    continue;
                }
                
                // Modifiez les from states
                $from = $transitionDef->getArgument(1);
                if (is_array($from)) {
                    $newFrom = [];
                    foreach ($from as $state) {
                        if ($state === 'addressed') {
                            $newFrom[] = 'cart';
                        } else {
                            $newFrom[] = $state;
                        }
                    }
                    $transitionDef->replaceArgument(1, array_unique($newFrom));
                } elseif ($from === 'addressed') {
                    $transitionDef->replaceArgument(1, 'cart');
                }
                
                $newTransitions[] = $transitionRef;
            }
        }
        
        $definition->replaceArgument(1, $newTransitions);
    }
}