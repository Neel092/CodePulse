import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Colors mapping
    replacements = [
        (r'bg-\[\#111111\]', r'bg-white dark:bg-[#111111]'),
        (r'bg-\[\#121212\]', r'bg-white dark:bg-[#121212]'),
        (r'bg-\[\#131313\]', r'bg-gray-50 dark:bg-[#131313]'),
        (r'bg-\[\#141414\]', r'bg-gray-50 dark:bg-[#141414]'),
        (r'bg-\[\#161616\]', r'bg-gray-50 dark:bg-[#161616]'),
        (r'bg-\[\#1A1A1A\]', r'bg-gray-100 dark:bg-[#1A1A1A]'),
        (r'bg-\[\#1C1C1C\]', r'bg-gray-100 dark:bg-[#1C1C1C]'),
        (r'bg-\[\#0A0A0A\]', r'bg-white dark:bg-[#0A0A0A]'),
        (r'bg-\[\#080808\]', r'bg-[#FAFAFA] dark:bg-[#080808]'),
        
        (r'border-\[\#1C1C1C\]', r'border-gray-200 dark:border-[#1C1C1C]'),
        (r'border-\[\#222222\]', r'border-gray-200 dark:border-[#222222]'),
        (r'border-\[\#242424\]', r'border-gray-200 dark:border-[#242424]'),
        (r'border-\[\#262626\]', r'border-gray-200 dark:border-[#262626]'),
        (r'border-\[\#333333\]', r'border-gray-300 dark:border-[#333333]'),
        
        # Regex to match border-white/[opacity] and prefix it with border-black/10 dark:
        (r'border-white/(\[[0-9\.]+\]|[0-9]+)', r'border-black/10 dark:border-white/\1'),
        (r'bg-white/(\[[0-9\.]+\]|[0-9]+)', r'bg-black/5 dark:bg-white/\1'),

        (r'text-\[\#E5E5E5\]', r'text-gray-900 dark:text-[#E5E5E5]'),
        (r'text-\[\#E0E0E0\]', r'text-gray-900 dark:text-[#E0E0E0]'),
        (r'text-white', r'text-black dark:text-white'),
        (r'text-\[\#888888\]', r'text-gray-500 dark:text-[#888888]'),
        (r'text-\[\#777777\]', r'text-gray-500 dark:text-[#777777]'),
        (r'text-\[\#666666\]', r'text-gray-400 dark:text-[#666666]'),
        (r'text-\[\#555555\]', r'text-gray-400 dark:text-[#555555]'),
        (r'text-\[\#444444\]', r'text-gray-400 dark:text-[#444444]'),
    ]

    new_content = content
    for pattern, repl in replacements:
        # Avoid double replacing if dark: is already present
        # We do this by a more complex regex or just applying
        new_content = re.sub(r'(?<!dark:)' + pattern, repl, new_content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')) and not 'layout.tsx' in file and not 'tailwind.config.ts' in file:
            process_file(os.path.join(root, file))
