// 第8回の部品:export default の例

/** サイズの表示名。F はフリー。 */
export default function sizeLabel(size: string): string {
  return size === 'F' ? 'フリー' : size
}
