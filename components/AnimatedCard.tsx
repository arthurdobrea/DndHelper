'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
    children: ReactNode;
    index: number;
}

/**
 * Компонент для анимации карточек при появлении
 * Карточки плавно выезжают снизу вверх с задержкой
 */
export default function AnimatedCard({ children, index }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.3,
                delay: index * 0.03,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ scale: 1.02 }}
        >
            {children}
        </motion.div>
    );
}

