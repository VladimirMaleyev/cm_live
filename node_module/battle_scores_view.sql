use cmsedna_test;
 
CREATE VIEW `battle_scores` AS select battle_id, round as round_nr, judge_id, concat(judge_id, ':', battle_id) as pair, (select count(*)  from scores_logs as t2 where valid = 1 and colours_id = 1 AND pair = concat(judge_id, ':', battle_id) AND round_nr = round) as red_score, (select count(*) from scores_logs as t2 where valid = 1 and colours_id = 2 AND pair = concat(judge_id, ':', battle_id) AND round_nr = round) as blue_score from scores_logs as t1  where valid = 1 GROUP BY judge_id, battle_id, round ORDER BY pair desc;
