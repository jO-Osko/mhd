# Generated by Django 2.2.4 on 2019-10-14 20:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mhd_data', '0012_auto_20191014_1947'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='graphassparse6',
            index=models.Index(fields=['item'], name='mhd_data_gr_item_id_da3b10_idx'),
        ),
        migrations.AddIndex(
            model_name='graphassparse6',
            index=models.Index(fields=['prop'], name='mhd_data_gr_prop_id_231816_idx'),
        ),
        migrations.AddIndex(
            model_name='graphassparse6',
            index=models.Index(fields=['value'], name='mhd_data_gr_value_0485f5_idx'),
        ),
        migrations.AddIndex(
            model_name='graphassparse6',
            index=models.Index(fields=['active'], name='mhd_data_gr_active_d649bc_idx'),
        ),
        migrations.AddIndex(
            model_name='itemcollectionassociation',
            index=models.Index(fields=['item'], name='mhd_data_it_item_id_06636f_idx'),
        ),
        migrations.AddIndex(
            model_name='itemcollectionassociation',
            index=models.Index(fields=['collection'], name='mhd_data_it_collect_d5b54b_idx'),
        ),
        migrations.AddIndex(
            model_name='listasarray_standardint',
            index=models.Index(fields=['item'], name='mhd_data_li_item_id_ab9e25_idx'),
        ),
        migrations.AddIndex(
            model_name='listasarray_standardint',
            index=models.Index(fields=['prop'], name='mhd_data_li_prop_id_e5fa8c_idx'),
        ),
        migrations.AddIndex(
            model_name='listasarray_standardint',
            index=models.Index(fields=['value'], name='mhd_data_li_value_d3c338_idx'),
        ),
        migrations.AddIndex(
            model_name='listasarray_standardint',
            index=models.Index(fields=['active'], name='mhd_data_li_active_c8c30d_idx'),
        ),
        migrations.AddIndex(
            model_name='listasarray_standardjson',
            index=models.Index(fields=['item'], name='mhd_data_li_item_id_2767c3_idx'),
        ),
        migrations.AddIndex(
            model_name='listasarray_standardjson',
            index=models.Index(fields=['prop'], name='mhd_data_li_prop_id_8f5db3_idx'),
        ),
        migrations.AddIndex(
            model_name='listasarray_standardjson',
            index=models.Index(fields=['value'], name='mhd_data_li_value_692a73_idx'),
        ),
        migrations.AddIndex(
            model_name='listasarray_standardjson',
            index=models.Index(fields=['active'], name='mhd_data_li_active_3f0b10_idx'),
        ),
        migrations.AddIndex(
            model_name='matrixaslist_standardint_2_2',
            index=models.Index(fields=['item'], name='mhd_data_ma_item_id_0038fe_idx'),
        ),
        migrations.AddIndex(
            model_name='matrixaslist_standardint_2_2',
            index=models.Index(fields=['prop'], name='mhd_data_ma_prop_id_649f1a_idx'),
        ),
        migrations.AddIndex(
            model_name='matrixaslist_standardint_2_2',
            index=models.Index(fields=['value'], name='mhd_data_ma_value_777dd0_idx'),
        ),
        migrations.AddIndex(
            model_name='matrixaslist_standardint_2_2',
            index=models.Index(fields=['active'], name='mhd_data_ma_active_ab47bc_idx'),
        ),
        migrations.AddIndex(
            model_name='matrixaslist_standardint_3_3',
            index=models.Index(fields=['item'], name='mhd_data_ma_item_id_f852f3_idx'),
        ),
        migrations.AddIndex(
            model_name='matrixaslist_standardint_3_3',
            index=models.Index(fields=['prop'], name='mhd_data_ma_prop_id_02bd51_idx'),
        ),
        migrations.AddIndex(
            model_name='matrixaslist_standardint_3_3',
            index=models.Index(fields=['value'], name='mhd_data_ma_value_3cff43_idx'),
        ),
        migrations.AddIndex(
            model_name='matrixaslist_standardint_3_3',
            index=models.Index(fields=['active'], name='mhd_data_ma_active_80c180_idx'),
        ),
        migrations.AddIndex(
            model_name='polynomialassparsearray',
            index=models.Index(fields=['item'], name='mhd_data_po_item_id_09c341_idx'),
        ),
        migrations.AddIndex(
            model_name='polynomialassparsearray',
            index=models.Index(fields=['prop'], name='mhd_data_po_prop_id_1f3632_idx'),
        ),
        migrations.AddIndex(
            model_name='polynomialassparsearray',
            index=models.Index(fields=['value'], name='mhd_data_po_value_9fd320_idx'),
        ),
        migrations.AddIndex(
            model_name='polynomialassparsearray',
            index=models.Index(fields=['active'], name='mhd_data_po_active_b4fcc8_idx'),
        ),
        migrations.AddIndex(
            model_name='standardbool',
            index=models.Index(fields=['item'], name='mhd_data_st_item_id_bb66ec_idx'),
        ),
        migrations.AddIndex(
            model_name='standardbool',
            index=models.Index(fields=['prop'], name='mhd_data_st_prop_id_f993f0_idx'),
        ),
        migrations.AddIndex(
            model_name='standardbool',
            index=models.Index(fields=['value'], name='mhd_data_st_value_149d4a_idx'),
        ),
        migrations.AddIndex(
            model_name='standardbool',
            index=models.Index(fields=['active'], name='mhd_data_st_active_1007b3_idx'),
        ),
        migrations.AddIndex(
            model_name='standardint',
            index=models.Index(fields=['item'], name='mhd_data_st_item_id_253a32_idx'),
        ),
        migrations.AddIndex(
            model_name='standardint',
            index=models.Index(fields=['prop'], name='mhd_data_st_prop_id_43d25f_idx'),
        ),
        migrations.AddIndex(
            model_name='standardint',
            index=models.Index(fields=['value'], name='mhd_data_st_value_378d28_idx'),
        ),
        migrations.AddIndex(
            model_name='standardint',
            index=models.Index(fields=['active'], name='mhd_data_st_active_c1890f_idx'),
        ),
        migrations.AddIndex(
            model_name='standardjson',
            index=models.Index(fields=['item'], name='mhd_data_st_item_id_2c1d86_idx'),
        ),
        migrations.AddIndex(
            model_name='standardjson',
            index=models.Index(fields=['prop'], name='mhd_data_st_prop_id_5479dd_idx'),
        ),
        migrations.AddIndex(
            model_name='standardjson',
            index=models.Index(fields=['value'], name='mhd_data_st_value_6b622a_idx'),
        ),
        migrations.AddIndex(
            model_name='standardjson',
            index=models.Index(fields=['active'], name='mhd_data_st_active_73a179_idx'),
        ),
        migrations.AddIndex(
            model_name='standardstring',
            index=models.Index(fields=['item'], name='mhd_data_st_item_id_4d9502_idx'),
        ),
        migrations.AddIndex(
            model_name='standardstring',
            index=models.Index(fields=['prop'], name='mhd_data_st_prop_id_bb94ce_idx'),
        ),
        migrations.AddIndex(
            model_name='standardstring',
            index=models.Index(fields=['value'], name='mhd_data_st_value_e6c0bc_idx'),
        ),
        migrations.AddIndex(
            model_name='standardstring',
            index=models.Index(fields=['active'], name='mhd_data_st_active_32b893_idx'),
        ),
    ]